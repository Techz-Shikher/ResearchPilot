#!/usr/bin/env python3
"""
🚀 ResearchPilot AI Backend - Startup Script with Diagnostics
Shows exactly what's happening when you start the server
"""

import subprocess
import sys
import os

def main():
    print("\n" + "╔" + "═"*78 + "╗" + "\n" +
          "║" + " "*78 + "║\n" +
          "║" + "🚀 ResearchPilot AI Backend - Starting Server".center(78) + "║\n" +
          "║" + " "*78 + "║\n" +
          "╚" + "═"*78 + "╝" + "\n")
    
    print("📝 Running diagnostics before startup...\n")
    
    # Run diagnostics
    try:
        result = subprocess.run([sys.executable, "diagnose.py"], cwd=os.path.dirname(__file__))
        if result.returncode != 0:
            print("\n⚠️  WARNING: Some configuration issues detected")
            print("   But the server will try to start anyway...")
            print("   (Check logs for API errors if things don't work)\n")
    except:
        pass
    
    print("\n" + "="*80)
    print("🚀 STARTING BACKEND SERVER...")
    print("="*80)
    print("\n⏳ Server starting on http://localhost:8000")
    print("📊 API Health at http://localhost:8000/api/health")
    print("🔍 API Docs at http://localhost:8000/docs")
    print("\n✋ Press Ctrl+C to stop the server\n")
    print("="*80 + "\n")
    
    # Start the server
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            "main_enhanced:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload"
        ], cwd=os.path.dirname(__file__))
    except KeyboardInterrupt:
        print("\n\n" + "="*80)
        print("⛔ Server stopped by user")
        print("="*80 + "\n")

if __name__ == "__main__":
    main()
