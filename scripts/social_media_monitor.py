
"""
Social Media Monitoring Script for Reddit and Twitter
This script fetches posts from Reddit and Twitter using their APIs and analyzes them for toxicity.
"""

import tweepy
import praw
import requests
import json
from datetime import datetime, timedelta
import os
import time

# TODO: Add these credentials to your environment variables or Supabase secrets
TWITTER_API_KEY = os.getenv('TWITTER_API_KEY')
TWITTER_API_SECRET = os.getenv('TWITTER_API_SECRET')
TWITTER_ACCESS_TOKEN = os.getenv('TWITTER_ACCESS_TOKEN')
TWITTER_ACCESS_TOKEN_SECRET = os.getenv('TWITTER_ACCESS_TOKEN_SECRET')

REDDIT_CLIENT_ID = os.getenv('REDDIT_CLIENT_ID')
REDDIT_CLIENT_SECRET = os.getenv('REDDIT_CLIENT_SECRET')
REDDIT_USER_AGENT = os.getenv('REDDIT_USER_AGENT', 'SafeGuardBot/1.0')

# Flask backend endpoint for storing analyzed data
BACKEND_API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:5000')

class SocialMediaMonitor:
    def __init__(self):
        self.setup_twitter_api()
        self.setup_reddit_api()
    
    def setup_twitter_api(self):
        """Initialize Twitter API v1.1 client"""
        try:
            auth = tweepy.OAuthHandler(TWITTER_API_KEY, TWITTER_API_SECRET)
            auth.set_access_token(TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET)
            self.twitter_api = tweepy.API(auth, wait_on_rate_limit=True)
            print("Twitter API initialized successfully")
        except Exception as e:
            print(f"Error initializing Twitter API: {e}")
            self.twitter_api = None
    
    def setup_reddit_api(self):
        """Initialize Reddit API client"""
        try:
            self.reddit = praw.Reddit(
                client_id=REDDIT_CLIENT_ID,
                client_secret=REDDIT_CLIENT_SECRET,
                user_agent=REDDIT_USER_AGENT
            )
            print("Reddit API initialized successfully")
        except Exception as e:
            print(f"Error initializing Reddit API: {e}")
            self.reddit = None
    
    def analyze_toxicity(self, text, platform, author=None):
        """
        Analyze text for various types of toxicity
        TODO: Connect to your Flask NLP backend API
        """
        try:
            response = requests.post(f"{BACKEND_API_URL}/api/analyze-toxicity", json={
                'text': text,
                'platform': platform,
                'author': author
            })
            
            if response.status_code == 200:
                return response.json()
            else:
                # Fallback analysis (simplified)
                return self.simple_toxicity_analysis(text)
        except:
            return self.simple_toxicity_analysis(text)
    
    def simple_toxicity_analysis(self, text):
        """Simple keyword-based toxicity detection as fallback"""
        text_lower = text.lower()
        
        # Keywords for different types of toxicity
        bullying_keywords = ['stupid', 'loser', 'worthless', 'kill yourself', 'die']
        racism_keywords = ['racial slurs', 'hate speech terms'] # Add actual terms carefully
        harassment_keywords = ['stalking', 'threatening', 'harass']
        blackmail_keywords = ['expose', 'leak', 'blackmail', 'extort']
        gender_bias_keywords = ['sexist terms', 'gender hate'] # Add actual terms carefully
        
        scores = {
            'cyberbullying': sum(1 for word in bullying_keywords if word in text_lower) * 20,
            'racism': sum(1 for word in racism_keywords if word in text_lower) * 25,
            'harassment': sum(1 for word in harassment_keywords if word in text_lower) * 30,
            'blackmail': sum(1 for word in blackmail_keywords if word in text_lower) * 35,
            'gender_bias': sum(1 for word in gender_bias_keywords if word in text_lower) * 25
        }
        
        # Cap scores at 100
        for key in scores:
            scores[key] = min(scores[key], 100)
        
        overall_severity = 'high' if max(scores.values()) > 50 else 'medium' if max(scores.values()) > 25 else 'low'
        
        return {
            'toxicity_scores': scores,
            'severity': overall_severity,
            'confidence': 0.7,  # Lower confidence for simple analysis
            'platform': 'reddit' if 'reddit' in text_lower else 'twitter'
        }
    
    def monitor_twitter(self, keywords=['bullying', 'harassment', 'cyberbully'], count=50):
        """Monitor Twitter for toxic content"""
        if not self.twitter_api:
            print("Twitter API not available")
            return []
        
        results = []
        try:
            tweets = tweepy.Cursor(
                self.twitter_api.search_tweets,
                q=' OR '.join(keywords),
                lang='en',
                result_type='recent',
                include_entities=False
            ).items(count)
            
            for tweet in tweets:
                analysis = self.analyze_toxicity(
                    tweet.text, 
                    'twitter', 
                    tweet.user.screen_name
                )
                
                result = {
                    'id': tweet.id,
                    'platform': 'twitter',
                    'content': tweet.text,
                    'author': tweet.user.screen_name,
                    'created_at': tweet.created_at.isoformat(),
                    'location': getattr(tweet.user, 'location', 'Unknown'),
                    'analysis': analysis,
                    'url': f"https://twitter.com/{tweet.user.screen_name}/status/{tweet.id}"
                }
                
                results.append(result)
                
                # If high severity, send immediately to backend
                if analysis['severity'] == 'high':
                    self.send_to_backend(result)
            
            print(f"Monitored {len(results)} tweets")
            return results
            
        except Exception as e:
            print(f"Error monitoring Twitter: {e}")
            return []
    
    def monitor_reddit(self, subreddits=['cyberbullying', 'harassment', 'help'], limit=25):
        """Monitor Reddit for toxic content"""
        if not self.reddit:
            print("Reddit API not available")
            return []
        
        results = []
        try:
            for subreddit_name in subreddits:
                subreddit = self.reddit.subreddit(subreddit_name)
                
                for submission in subreddit.new(limit=limit):
                    # Analyze post content
                    full_text = f"{submission.title} {submission.selftext}"
                    analysis = self.analyze_toxicity(
                        full_text, 
                        'reddit', 
                        submission.author.name if submission.author else 'deleted'
                    )
                    
                    result = {
                        'id': submission.id,
                        'platform': 'reddit',
                        'subreddit': subreddit_name,
                        'title': submission.title,
                        'content': submission.selftext,
                        'author': submission.author.name if submission.author else 'deleted',
                        'created_at': datetime.fromtimestamp(submission.created_utc).isoformat(),
                        'score': submission.score,
                        'url': f"https://reddit.com{submission.permalink}",
                        'analysis': analysis
                    }
                    
                    results.append(result)
                    
                    # If high severity, send immediately to backend
                    if analysis['severity'] == 'high':
                        self.send_to_backend(result)
            
            print(f"Monitored {len(results)} Reddit posts")
            return results
            
        except Exception as e:
            print(f"Error monitoring Reddit: {e}")
            return []
    
    def send_to_backend(self, data):
        """Send analyzed data to Flask backend"""
        try:
            response = requests.post(f"{BACKEND_API_URL}/api/social-reports", json=data)
            if response.status_code == 200:
                print(f"Sent {data['platform']} post {data['id']} to backend")
            else:
                print(f"Failed to send data to backend: {response.status_code}")
        except Exception as e:
            print(f"Error sending to backend: {e}")
    
    def run_monitoring_cycle(self):
        """Run a complete monitoring cycle"""
        print(f"Starting monitoring cycle at {datetime.now()}")
        
        # Monitor Twitter
        twitter_results = self.monitor_twitter()
        
        # Monitor Reddit
        reddit_results = self.monitor_reddit()
        
        # Combine and send bulk data to backend
        all_results = twitter_results + reddit_results
        
        if all_results:
            try:
                response = requests.post(f"{BACKEND_API_URL}/api/bulk-social-reports", json={
                    'reports': all_results,
                    'timestamp': datetime.now().isoformat(),
                    'total_count': len(all_results)
                })
                print(f"Sent {len(all_results)} total reports to backend")
            except Exception as e:
                print(f"Error sending bulk data: {e}")
        
        return all_results

def main():
    """Main function to run the social media monitor"""
    monitor = SocialMediaMonitor()
    
    # Run monitoring every 30 minutes
    while True:
        try:
            results = monitor.run_monitoring_cycle()
            print(f"Cycle completed. Found {len(results)} posts.")
            
            # Wait 30 minutes before next cycle
            time.sleep(1800)  # 30 minutes
            
        except KeyboardInterrupt:
            print("Monitoring stopped by user")
            break
        except Exception as e:
            print(f"Error in monitoring cycle: {e}")
            time.sleep(300)  # Wait 5 minutes before retrying

if __name__ == "__main__":
    main()
