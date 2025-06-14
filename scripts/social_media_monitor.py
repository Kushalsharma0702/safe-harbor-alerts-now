
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
from googleapiclient import discovery

# API Credentials
TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAABJC1AEAAAAAwmqwLL55h%2FBnI3br1%2FDx1lvZqV0%3DLD9Pzpt2mideqyKTpNllcpTYN4qecNTbR0hY70IhRsjzvBoGm3'

REDDIT_CLIENT_ID = 'XohEiaMksRLDchPPjFXZZw'
REDDIT_CLIENT_SECRET = 'CW3jjtGrvNo6Za8fSP7JwSWY6lMSxw'
REDDIT_USER_AGENT = 'HakuHateSpeechBot/0.1 by Kushal'

PERSPECTIVE_API_KEY = 'AIzaSyArraq7giNrnAU3vWRODqzzUdamkAHUyC0'

# Twilio credentials for WhatsApp notifications
TWILIO_ACCOUNT_SID = 'AC230554cc64143ee1a9d9ea860027a555'
TWILIO_AUTH_TOKEN = '0ec89b3cb651382abdbcc08ad2a697fc'
FROM_WHATSAPP = 'whatsapp:+14155238886'
TO_WHATSAPP = 'whatsapp:+919310063601'

# Flask backend endpoint for storing analyzed data
BACKEND_API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:5000')

class SocialMediaMonitor:
    def __init__(self):
        self.setup_twitter_api()
        self.setup_reddit_api()
        self.setup_perspective_api()
        self.setup_twilio()
    
    def setup_twitter_api(self):
        """Initialize Twitter API v2 client"""
        try:
            self.twitter_client = tweepy.Client(bearer_token=TWITTER_BEARER_TOKEN)
            print("Twitter API v2 initialized successfully")
        except Exception as e:
            print(f"Error initializing Twitter API: {e}")
            self.twitter_client = None
    
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
    
    def setup_perspective_api(self):
        """Initialize Google Perspective API for toxicity analysis"""
        try:
            self.perspective_service = discovery.build(
                "commentanalyzer",
                "v1alpha1",
                developerKey=PERSPECTIVE_API_KEY,
                discoveryServiceUrl="https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1",
                static_discovery=False,
            )
            print("Google Perspective API initialized successfully")
        except Exception as e:
            print(f"Error initializing Perspective API: {e}")
            self.perspective_service = None
    
    def setup_twilio(self):
        """Initialize Twilio for WhatsApp notifications"""
        try:
            from twilio.rest import Client
            self.twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            print("Twilio WhatsApp client initialized successfully")
        except Exception as e:
            print(f"Error initializing Twilio: {e}")
            self.twilio_client = None
    
    def analyze_toxicity_perspective(self, text):
        """Use Google Perspective API for advanced toxicity analysis"""
        if not self.perspective_service:
            return self.simple_toxicity_analysis(text)
        
        try:
            analyze_request = {
                'comment': {'text': text},
                'requestedAttributes': {
                    'TOXICITY': {},
                    'SEVERE_TOXICITY': {},
                    'IDENTITY_ATTACK': {},
                    'INSULT': {},
                    'PROFANITY': {},
                    'THREAT': {},
                    'SEXUALLY_EXPLICIT': {},
                    'FLIRTATION': {}
                }
            }
            
            response = self.perspective_service.comments().analyze(body=analyze_request).execute()
            scores = response['attributeScores']
            
            toxicity_scores = {
                'cyberbullying': int(scores.get('INSULT', {}).get('summaryScore', {}).get('value', 0) * 100),
                'racism': int(scores.get('IDENTITY_ATTACK', {}).get('summaryScore', {}).get('value', 0) * 100),
                'harassment': int(scores.get('THREAT', {}).get('summaryScore', {}).get('value', 0) * 100),
                'blackmail': int(scores.get('SEVERE_TOXICITY', {}).get('summaryScore', {}).get('value', 0) * 100),
                'gender_bias': int(scores.get('SEXUALLY_EXPLICIT', {}).get('summaryScore', {}).get('value', 0) * 100),
                'overall_toxicity': int(scores.get('TOXICITY', {}).get('summaryScore', {}).get('value', 0) * 100)
            }
            
            max_score = max(toxicity_scores.values())
            severity = 'high' if max_score > 70 else 'medium' if max_score > 40 else 'low'
            
            return {
                'toxicity_scores': toxicity_scores,
                'severity': severity,
                'confidence': 0.95,
                'analysis_method': 'google_perspective'
            }
            
        except Exception as e:
            print(f"Error with Perspective API: {e}")
            return self.simple_toxicity_analysis(text)
    
    def simple_toxicity_analysis(self, text):
        """Fallback simple keyword-based toxicity detection"""
        text_lower = text.lower()
        
        bullying_keywords = ['stupid', 'loser', 'worthless', 'kill yourself', 'die', 'ugly', 'fat', 'dumb']
        racism_keywords = ['racist terms placeholder'] # Add carefully vetted terms
        harassment_keywords = ['stalking', 'threatening', 'harass', 'follow you', 'find you']
        blackmail_keywords = ['expose', 'leak', 'blackmail', 'extort', 'pay me', 'or else']
        gender_bias_keywords = ['sexist terms placeholder'] # Add carefully vetted terms
        
        scores = {
            'cyberbullying': min(sum(1 for word in bullying_keywords if word in text_lower) * 25, 100),
            'racism': min(sum(1 for word in racism_keywords if word in text_lower) * 30, 100),
            'harassment': min(sum(1 for word in harassment_keywords if word in text_lower) * 35, 100),
            'blackmail': min(sum(1 for word in blackmail_keywords if word in text_lower) * 40, 100),
            'gender_bias': min(sum(1 for word in gender_bias_keywords if word in text_lower) * 30, 100),
            'overall_toxicity': 0
        }
        
        scores['overall_toxicity'] = int(sum(scores.values()) / len(scores))
        max_score = max(scores.values())
        severity = 'high' if max_score > 60 else 'medium' if max_score > 30 else 'low'
        
        return {
            'toxicity_scores': scores,
            'severity': severity,
            'confidence': 0.6,
            'analysis_method': 'keyword_based'
        }
    
    def send_whatsapp_alert(self, analysis_data):
        """Send WhatsApp alert for high severity cases"""
        if not self.twilio_client or analysis_data['severity'] != 'high':
            return
        
        try:
            message_body = f"""
🚨 HIGH SEVERITY ALERT 🚨
Platform: {analysis_data.get('platform', 'Unknown')}
Toxicity Level: {analysis_data['toxicity_scores']['overall_toxicity']}%
Author: {analysis_data.get('author', 'Anonymous')}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Content Preview: {analysis_data.get('content', '')[:100]}...
            """
            
            self.twilio_client.messages.create(
                body=message_body,
                from_=FROM_WHATSAPP,
                to=TO_WHATSAPP
            )
            print("WhatsApp alert sent successfully")
        except Exception as e:
            print(f"Error sending WhatsApp alert: {e}")
    
    def monitor_twitter(self, keywords=['bullying', 'harassment', 'cyberbully', 'hate'], count=50):
        """Monitor Twitter for toxic content using API v2"""
        if not self.twitter_client:
            print("Twitter API not available")
            return []
        
        results = []
        try:
            query = ' OR '.join(keywords) + ' -is:retweet lang:en'
            tweets = self.twitter_client.search_recent_tweets(
                query=query,
                max_results=min(count, 100),
                tweet_fields=['created_at', 'author_id', 'context_annotations', 'public_metrics']
            )
            
            if tweets.data:
                for tweet in tweets.data:
                    analysis = self.analyze_toxicity_perspective(tweet.text)
                    analysis['platform'] = 'twitter'
                    
                    result = {
                        'id': tweet.id,
                        'platform': 'twitter',
                        'content': tweet.text,
                        'author': tweet.author_id,
                        'created_at': tweet.created_at.isoformat() if tweet.created_at else datetime.now().isoformat(),
                        'metrics': tweet.public_metrics if hasattr(tweet, 'public_metrics') else {},
                        'analysis': analysis,
                        'url': f"https://twitter.com/user/status/{tweet.id}"
                    }
                    
                    results.append(result)
                    
                    # Send WhatsApp alert for high severity
                    if analysis['severity'] == 'high':
                        self.send_whatsapp_alert({**result, **analysis})
                        self.send_to_backend(result)
            
            print(f"Monitored {len(results)} tweets")
            return results
            
        except Exception as e:
            print(f"Error monitoring Twitter: {e}")
            return []
    
    def monitor_reddit(self, subreddits=['cyberbullying', 'harassment', 'help', 'mentalhealth'], limit=25):
        """Monitor Reddit for toxic content"""
        if not self.reddit:
            print("Reddit API not available")
            return []
        
        results = []
        try:
            for subreddit_name in subreddits:
                try:
                    subreddit = self.reddit.subreddit(subreddit_name)
                    
                    for submission in subreddit.new(limit=limit):
                        full_text = f"{submission.title} {submission.selftext}"
                        if len(full_text.strip()) < 10:
                            continue
                            
                        analysis = self.analyze_toxicity_perspective(full_text)
                        analysis['platform'] = 'reddit'
                        
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
                        
                        # Send WhatsApp alert for high severity
                        if analysis['severity'] == 'high':
                            self.send_whatsapp_alert({**result, **analysis})
                            self.send_to_backend(result)
                            
                except Exception as e:
                    print(f"Error accessing subreddit {subreddit_name}: {e}")
                    continue
            
            print(f"Monitored {len(results)} Reddit posts")
            return results
            
        except Exception as e:
            print(f"Error monitoring Reddit: {e}")
            return []
    
    def send_to_backend(self, data):
        """Send analyzed data to Flask backend"""
        try:
            response = requests.post(f"{BACKEND_API_URL}/api/social-reports", json=data, timeout=10)
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
                    'total_count': len(all_results),
                    'high_severity_count': len([r for r in all_results if r['analysis']['severity'] == 'high'])
                }, timeout=15)
                
                if response.status_code == 200:
                    print(f"Successfully sent {len(all_results)} total reports to backend")
                else:
                    print(f"Failed to send bulk data: {response.status_code}")
            except Exception as e:
                print(f"Error sending bulk data: {e}")
        
        return all_results

def main():
    """Main function to run the social media monitor"""
    monitor = SocialMediaMonitor()
    
    print("🚀 Starting Social Media Toxicity Monitor")
    print("🔍 Monitoring Twitter and Reddit for toxic content...")
    print("📱 WhatsApp alerts enabled for high-severity cases")
    print("=" * 50)
    
    # Run monitoring every 15 minutes
    while True:
        try:
            results = monitor.run_monitoring_cycle()
            high_severity = [r for r in results if r['analysis']['severity'] == 'high']
            
            print(f"✅ Cycle completed. Found {len(results)} posts ({len(high_severity)} high severity).")
            
            if high_severity:
                print(f"🚨 {len(high_severity)} high-severity incidents detected and reported!")
            
            print(f"⏰ Next scan in 15 minutes...\n")
            
            # Wait 15 minutes before next cycle
            time.sleep(900)  # 15 minutes
            
        except KeyboardInterrupt:
            print("\n🛑 Monitoring stopped by user")
            break
        except Exception as e:
            print(f"❌ Error in monitoring cycle: {e}")
            print("⏰ Retrying in 5 minutes...")
            time.sleep(300)  # Wait 5 minutes before retrying

if __name__ == "__main__":
    main()
