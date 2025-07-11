#!/usr/bin/env python3
"""
Collaborative Editor - Python Example
This file is loaded from the server workspace
"""

import json
import time
from typing import Dict, List, Optional

class CollaborativeSession:
    """Represents a collaborative editing session"""
    
    def __init__(self, room_id: str):
        self.room_id = room_id
        self.users: List[Dict] = []
        self.created_at = time.time()
    
    def add_user(self, user_id: str, username: str) -> None:
        """Add a user to the collaborative session"""
        user = {
            'id': user_id,
            'username': username,
            'joined_at': time.time()
        }
        self.users.append(user)
        print(f"User {username} joined room {self.room_id}")
    
    def remove_user(self, user_id: str) -> None:
        """Remove a user from the collaborative session"""
        self.users = [user for user in self.users if user['id'] != user_id]
        print(f"User {user_id} left room {self.room_id}")
    
    def get_active_users(self) -> List[str]:
        """Get list of active usernames"""
        return [user['username'] for user in self.users]
    
    def get_session_info(self) -> Dict:
        """Get session information"""
        return {
            'room_id': self.room_id,
            'user_count': len(self.users),
            'active_users': self.get_active_users(),
            'uptime': time.time() - self.created_at
        }

def main():
    """Main function to demonstrate collaborative features"""
    # Create a new collaborative session
    session = CollaborativeSession("demo-room")
    
    # Add some users
    session.add_user("user1", "Alice")
    session.add_user("user2", "Bob")
    session.add_user("user3", "Charlie")
    
    # Display session info
    info = session.get_session_info()
    print(f"\nSession Info:")
    print(f"Room ID: {info['room_id']}")
    print(f"Active Users: {', '.join(info['active_users'])}")
    print(f"Total Users: {info['user_count']}")
    
    # TODO: Add your collaborative logic here
    print("\nReady for collaborative editing!")

if __name__ == "__main__":
    main() 