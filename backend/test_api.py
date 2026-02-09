#!/usr/bin/env python3
"""
Quick test script to verify ResearchPilot AI backend is working correctly
"""

import requests
import json
import os
from pathlib import Path

API_URL = "http://localhost:8000"

def test_health():
    """Test if backend is running"""
    print("\n🏥 Testing backend health...")
    try:
        response = requests.get(f"{API_URL}/api/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend is running!")
            print(f"   AI Enabled: {data.get('ai_enabled')}")
            print(f"   Features: {json.dumps(data.get('features'), indent=6)}")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend at {API_URL}")
        print(f"   Error: {e}")
        print(f"   Make sure backend is running: python main_enhanced.py")
        return False

def test_upload_pdf():
    """Test PDF upload"""
    print("\n📄 Testing PDF upload...")
    
    # Create a simple test PDF file
    test_file_path = Path(__file__).parent / "test_document.txt"
    
    if not test_file_path.exists():
        print(f"⚠️  No test PDF found at {test_file_path}")
        print("   To test fully, upload a PDF through the web interface")
        return None
    
    try:
        with open(test_file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{API_URL}/api/upload", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ PDF upload successful!")
            print(f"   Extracted text length: {data.get('text_length')} chars")
            print(f"   Preview: {data.get('preview')[:100]}...")
            return data.get('extracted_text')
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Upload error: {e}")
        return None

def test_summarize():
    """Test PDF summarization"""
    print("\n📝 Testing PDF summarization...")
    
    sample_text = """
    This paper proposes a novel deep learning architecture called TransformerPlus 
    that improves upon the standard transformer model. We evaluate on ImageNet 
    and achieve 95% accuracy, beating previous state-of-the-art by 2%. 
    The key innovation is using multi-head self-attention with adaptive computation time.
    We conducted experiments on 4 different datasets and the results are consistent.
    """
    
    try:
        response = requests.post(
            f"{API_URL}/api/summarize",
            json={
                "paper_id": "test_paper_001",
                "text": sample_text,
                "title": "TransformerPlus: Improved Deep Learning Architecture"
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Summarization successful!")
            print(f"   AI Generated: {data.get('ai_generated')}")
            print(f"   Source: {data.get('source')}")
            print(f"   Summary: {data.get('summary')[:200]}...")
            return True
        else:
            print(f"❌ Summarization failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Summarization error: {e}")
        return False

def test_ask_question():
    """Test question answering"""
    print("\n❓ Testing Q&A...")
    
    sample_text = """
    We propose TransformerPlus with three key contributions:
    1. The adaptive attention mechanism that reduces computation
    2. Multi-scale feature extraction that improves accuracy
    3. A novel training strategy using curriculum learning
    
    We evaluate this on ImageNet, COCO, and Pascal VOC datasets.
    The results show 95% accuracy on ImageNet, 58% mAP on COCO, 
    and 89% mIoU on Pascal VOC, significantly outperforming baselines.
    """
    
    try:
        response = requests.post(
            f"{API_URL}/api/ask",
            json={
                "paper_id": "test_paper_001",
                "question": "What are the main contributions of this paper?",
                "text": sample_text
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Q&A successful!")
            print(f"   AI Generated: {data.get('ai_generated')}")
            print(f"   Answer: {data.get('answer')[:300]}...")
            return True
        else:
            print(f"❌ Q&A failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Q&A error: {e}")
        return False

def check_env_file():
    """Check if .env file is configured"""
    print("\n⚙️  Checking environment configuration...")
    
    env_path = Path(__file__).parent / ".env"
    
    if not env_path.exists():
        print(f"⚠️  No .env file found")
        print(f"   Copy .env.example to .env and add your API keys")
        return False
    
    try:
        with open(env_path, 'r') as f:
            content = f.read().upper()
        
        providers = {
            'GEMINI_API_KEY': '🔵 Gemini',
            'GROQ_API_KEY': '⚡ Groq',
            'OPENAI_API_KEY': '🤖 OpenAI',
            'HF_API_KEY': '🤗 Hugging Face'
        }
        
        configured = False
        for key, name in providers.items():
            if key in content and f'{key}=your_' not in content:
                print(f"✅ {name} appears configured")
                configured = True
            elif key in content:
                print(f"⚠️  {name} placeholder detected (not filled in)")
            else:
                print(f"❌ {name} not configured")
        
        if not configured:
            print(f"\n⚠️  No AI providers configured yet!")
            print(f"   Edit .env and add at least one API key")
            return False
        
        return True
    except Exception as e:
        print(f"❌ Error checking .env: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 ResearchPilot AI Backend - Quick Test")
    print("=" * 60)
    
    # Check configuration
    check_env_file()
    
    # Test health
    if not test_health():
        print("\n" + "=" * 60)
        print("❌ Backend is not running!")
        print("   Start it with: python main_enhanced.py")
        return
    
    # Test endpoints
    test_summarize()
    test_ask_question()
    
    print("\n" + "=" * 60)
    print("✅ All tests completed!")
    print("   Upload a PDF through the web interface to test fully")
    print("=" * 60)

if __name__ == "__main__":
    main()
