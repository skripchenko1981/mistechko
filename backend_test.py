#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class CommunityPortalAPITester:
    def __init__(self, base_url="https://local-portal-3.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            details = f"Expected {expected_status}, got {response.status_code}"
            if not success and response.text:
                try:
                    error_data = response.json()
                    details += f" - {error_data.get('detail', response.text[:100])}"
                except:
                    details += f" - {response.text[:100]}"
            
            self.log_test(name, success, details)
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        print("\n🏥 Testing Health Check...")
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        if success and response.get('status') == 'healthy':
            print("   Health endpoint working correctly")
            return True
        else:
            print("   Health endpoint issue")
            return False

    def test_radas_endpoint(self):
        """Test radas endpoint"""
        print("\n🏛️ Testing Radas Endpoint...")
        success, response = self.run_test(
            "Get Radas",
            "GET",
            "radas",
            200
        )
        if success and isinstance(response, list) and len(response) >= 2:
            print(f"   Found {len(response)} radas")
            for rada in response:
                if rada.get('id') in ['rada1', 'rada2']:
                    print(f"   ✓ {rada.get('short_name')}: {rada.get('name')}")
            return True
        else:
            print("   Radas endpoint issue - should return list with 2 radas")
            return False

    def test_news_endpoint(self):
        """Test news endpoint"""
        print("\n📰 Testing News Endpoint...")
        success, response = self.run_test(
            "Get News",
            "GET",
            "news",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} news items")
            if len(response) > 0:
                news_item = response[0]
                print(f"   Latest: {news_item.get('title', 'No title')[:50]}")
            return True
        else:
            print("   News endpoint issue")
            return False

    def test_news_filtering(self):
        """Test news filtering by rada"""
        print("\n📰 Testing News Filtering...")
        
        # Test rada1 filtering
        success1, response1 = self.run_test(
            "Get News for Rada1",
            "GET",
            "news?rada=rada1",
            200
        )
        
        # Test rada2 filtering  
        success2, response2 = self.run_test(
            "Get News for Rada2", 
            "GET",
            "news?rada=rada2",
            200
        )
        
        return success1 and success2

    def test_announcements_endpoint(self):
        """Test announcements endpoint"""
        print("\n📢 Testing Announcements Endpoint...")
        success, response = self.run_test(
            "Get Announcements",
            "GET",
            "announcements",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} announcements")
            if len(response) > 0:
                announcement = response[0]
                print(f"   Latest: {announcement.get('title', 'No title')[:50]}")
            return True
        else:
            print("   Announcements endpoint issue")
            return False

    def test_admin_login(self, email="admin@moemistechko.ua", password="admin123"):
        """Test admin login"""
        print("\n🔐 Testing Admin Login...")
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        
        if success and 'token' in response and 'user' in response:
            self.token = response['token']
            self.user_id = response['user'].get('user_id')
            user_role = response['user'].get('role')
            print(f"   Logged in as: {response['user'].get('name')} (Role: {user_role})")
            print(f"   User ID: {self.user_id}")
            return True
        else:
            print("   Admin login failed")
            return False

    def test_auth_me(self):
        """Test auth/me endpoint"""
        print("\n👤 Testing Auth Me...")
        if not self.token:
            print("   Skipping - no token available")
            return False
            
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        
        if success and response.get('email'):
            print(f"   User: {response.get('name')} ({response.get('email')})")
            return True
        else:
            print("   Auth me failed")
            return False

    def test_user_registration(self):
        """Test user registration"""
        print("\n📝 Testing User Registration...")
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@test.com"
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "email": test_email,
                "password": "test123",
                "name": "Test User",
                "rada": "rada1"
            }
        )
        
        if success and 'token' in response:
            print(f"   Registered user: {test_email}")
            return True
        else:
            print("   Registration failed")
            return False

    def test_protected_endpoints(self):
        """Test endpoints that require authentication"""
        print("\n🛡️ Testing Protected Endpoints...")
        
        if not self.token:
            print("   Skipping - no token available")
            return False

        # Test creating news (admin only)
        news_data = {
            "title": "Test News Item",
            "content": "This is a test news content",
            "excerpt": "Test news excerpt",
            "category": "Test",
            "rada": "all"
        }
        
        success, response = self.run_test(
            "Create News (Admin)",
            "POST",
            "news",
            200,
            data=news_data
        )
        
        if success:
            print("   Successfully created news item")
            return True
        else:
            print("   Failed to create news item")
            return False

    def run_all_tests(self):
        """Run comprehensive API test suite"""
        print("🚀 Starting Community Portal API Tests")
        print("=" * 50)
        
        test_results = []
        
        # Basic health and endpoints
        test_results.append(self.test_health_check())
        test_results.append(self.test_radas_endpoint())
        test_results.append(self.test_news_endpoint())
        test_results.append(self.test_news_filtering())
        test_results.append(self.test_announcements_endpoint())
        
        # Authentication tests
        test_results.append(self.test_admin_login())
        test_results.append(self.test_auth_me())
        test_results.append(self.test_user_registration())
        test_results.append(self.test_protected_endpoints())
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("\n🎉 All tests passed!")
            return True
        else:
            print(f"\n⚠️  {self.tests_run - self.tests_passed} test(s) failed")
            return False

def main():
    """Main test execution"""
    print("🧪 Community Portal Backend API Testing")
    print(f"📅 Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Target: https://local-portal-3.preview.emergentagent.com")
    
    tester = CommunityPortalAPITester()
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())