#!/usr/bin/env python3
"""
🔍 ResearchPilot AI - Diagnostic Tool
Checks your API configuration and tells you exactly what's wrong
"""

import os
from pathlib import Path

def check_env_file():
    """Check if .env file exists and what's configured"""
    print("\n" + "="*80)
    print("🔍 CHECKING ENVIRONMENT CONFIGURATION")
    print("="*80)
    
    env_path = Path(__file__).parent / ".env"
    
    if not env_path.exists():
        print("\n❌ .env file NOT FOUND")
        print("   Location: %s" % env_path)
        print("\n   FIX THIS:")
        print("   1. Run: cp .env.example .env")
        print("   2. Edit .env and add your API key")
        return False
    
    print(f"\n✅ .env file found: {env_path}")
    
    # Read the file
    with open(env_path, 'r') as f:
        env_content = f.read()
    
    # Check each provider
    providers = {
        'GEMINI_API_KEY': {
            'name': '🔵 Google Gemini',
            'placeholder': 'your_gemini_api_key_here',
            'setup_url': 'https://ai.google.dev/',
            'cost': 'FREE (unlimited)',
            'speed': 'Medium'
        },
        'GROQ_API_KEY': {
            'name': '⚡ Groq',
            'placeholder': 'your_groq_api_key_here',
            'setup_url': 'https://console.groq.com/',
            'cost': 'FREE (30 req/min)',
            'speed': '⚡ Ultra-fast'
        },
        'OPENAI_API_KEY': {
            'name': '🤖 OpenAI (GPT)',
            'placeholder': 'sk-',
            'setup_url': 'https://platform.openai.com/api-keys',
            'cost': 'PAID',
            'speed': 'Medium'
        },
        'HF_API_KEY': {
            'name': '🤗 Hugging Face',
            'placeholder': 'your_huggingface_api_key_here',
            'setup_url': 'https://huggingface.co/settings/tokens',
            'cost': 'FREE (rate limited)',
            'speed': 'Slow'
        },
    }
    
    print("\n" + "-"*80)
    print("API PROVIDER STATUS:")
    print("-"*80)
    
    any_configured = False
    
    for key, info in providers.items():
        # Get value from env
        if key in env_content:
            # Extract the value
            for line in env_content.split('\n'):
                if line.startswith(key + '='):
                    value = line.split('=', 1)[1].strip()
                    
                    if not value or value == info['placeholder'] or value.startswith('your_'):
                        print(f"\n⚠️  {info['name']}")
                        print(f"   Status: NOT CONFIGURED (placeholder value)")
                        print(f"   Setup: {info['setup_url']}")
                        print(f"   Cost: {info['cost']}")
                    else:
                        print(f"\n✅ {info['name']}")
                        print(f"   Status: CONFIGURED")
                        print(f"   Key length: {len(value)} chars")
                        print(f"   Cost: {info['cost']}")
                        print(f"   Speed: {info['speed']}")
                        any_configured = True
                    break
        else:
            print(f"\n❌ {info['name']}")
            print(f"   Status: NOT FOUND IN .env")
    
    print("\n" + "="*80)
    if any_configured:
        print("✅ AT LEAST ONE PROVIDER IS CONFIGURED")
        print("   The app SHOULD be using real AI responses")
        print("\n   If you're still seeing generic responses:")
        print("   1. Check the backend logs for errors")
        print("   2. Restart the backend: python main_enhanced.py")
        print("   3. Try uploading a fresh PDF and asking new questions")
    else:
        print("❌ NO PROVIDERS ARE CONFIGURED!")
        print("   You need at least ONE API key to use real AI")
        print("\n   RECOMMENDED SETUP (2 minutes):")
        print("   1. Go to https://ai.google.dev/")
        print("   2. Click 'Get API Key'")
        print("   3. Copy the key")
        print("   4. Paste into .env next to GEMINI_API_KEY=")
        print("   5. Save and restart backend")
    
    print("="*80)
    return any_configured

def check_packages():
    """Check if required packages are installed"""
    print("\n" + "="*80)
    print("📦 CHECKING REQUIRED PACKAGES")
    print("="*80)
    
    packages = {
        'pdfplumber': '📄 PDF Extraction',
        'google.generativeai': '🔵 Gemini API',
        'groq': '⚡ Groq API',
        'openai': '🤖 OpenAI API',
        'requests': '🌐 HTTP Requests',
    }
    
    missing = []
    
    for package, description in packages.items():
        try:
            if '.' in package:
                parts = package.split('.')
                __import__(parts[0])
            else:
                __import__(package)
            print(f"✅ {description:30} - Installed")
        except ImportError:
            print(f"❌ {description:30} - MISSING")
            missing.append(package)
    
    if missing:
        print("\n" + "-"*80)
        print("INSTALL MISSING PACKAGES:")
        print("-"*80)
        print("\nRun this command:")
        print(f"  pip install {' '.join(missing)}")
        print("\nOr install all dependencies:")
        print(f"  pip install -r requirements.txt")
    else:
        print("\n✅ All required packages are installed!")
    
    print("="*80)
    return len(missing) == 0

def main():
    print("\n\n")
    print("╔" + "═"*78 + "╗")
    print("║" + " "*78 + "║")
    print("║" + "🔍 ResearchPilot AI - DIAGNOSTIC TOOL".center(78) + "║")
    print("║" + "Checking your configuration...".center(78) + "║")
    print("║" + " "*78 + "║")
    print("╚" + "═"*78 + "╝")
    
    # Check configuration
    config_ok = check_env_file()
    
    # Check packages
    packages_ok = check_packages()
    
    # Summary
    print("\n" + "="*80)
    print("📊 SUMMARY")
    print("="*80)
    
    if config_ok and packages_ok:
        print("\n✅ Everything looks good!")
        print("   • API keys are configured")
        print("   • All packages are installed")
        print("   • Backend should be using real AI")
        print("\n   Next steps:")
        print("   1. Start backend: python main_enhanced.py")
        print("   2. Upload a PDF")
        print("   3. Ask a question")
        print("   4. Check backend logs for 'SUCCESS' messages")
        return 0
    else:
        print("\n⚠️  Issues detected:")
        if not config_ok:
            print("   • API keys not properly configured")
            print("   • Solution: Edit .env and set at least one API key")
        if not packages_ok:
            print("   • Missing Python packages")
            print("   • Solution: Run 'pip install -r requirements.txt'")
        return 1

if __name__ == "__main__":
    exit_code = main()
    exit(exit_code)
