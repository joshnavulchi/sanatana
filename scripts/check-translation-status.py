"""
Simple Script to Continue Translating Karma Philosophy Conversations
This script shows you which conversations still need translation.
"""

import json

# Path to your file
FILE_PATH = r"c:\Users\r77LRC1G\OneDrive - Xerox\Documents\GitHub\sanatana\locales\hi\karma_philosophy.json"

def check_translation_status():
    """Check which conversations are translated and which aren't."""
    
    print("Checking translation status...\n")
    
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    conversations = data['karma_philosophy']['script']['conversation']
    
    telugu_count = 0
    hindi_count = 0
    empty_count = 0
    
    telugu_conversations = []
    
    for i, conv in enumerate(conversations, 1):
        message = conv.get('message', '')
        speaker = conv.get('speaker', '')
        
        if not message:
            empty_count += 1
        elif any('\u0c00' <= c <= '\u0c7f' for c in message):
            # Contains Telugu characters
            telugu_count += 1
            telugu_conversations.append({
                'index': i,
                'speaker': speaker,
                'message': message[:100] + '...' if len(message) > 100 else message
            })
        else:
            # Likely Hindi or already translated
            hindi_count += 1
    
    total = len(conversations)
    
    print(f"📊 TRANSLATION STATUS REPORT")
    print(f"{'='*60}")
    print(f"Total conversations: {total}")
    print(f"Already translated to Hindi: {hindi_count}")
    print(f"Still in Telugu: {telugu_count}")
    print(f"Empty messages: {empty_count}")
    print(f"{'='*60}\n")
    
    if telugu_conversations:
        print(f"🔍 CONVERSATIONS STILL IN TELUGU:\n")
        for conv in telugu_conversations[:10]:  # Show first 10
            print(f"  #{conv['index']} [{conv['speaker']}]")
            print(f"    Telugu: {conv['message']}")
            print()
        
        if len(telugu_conversations) > 10:
            print(f"  ... and {len(telugu_conversations) - 10} more\n")
    
    print(f"\n✅ Good news! {hindi_count} out of {total} conversations are already in Hindi!")
    print(f"⏳ Remaining: {telugu_count} conversations need translation\n")
    
    return telugu_conversations

if __name__ == "__main__":
    check_translation_status()
    
    print("\n" + "="*60)
    print("NEXT STEPS:")
    print("="*60)
    print("Since you've already translated the first 10 conversations,")
    print("I can continue translating the remaining ones in batches.")
    print("\nWould you like me to:")
    print("  1. Continue translating via multiple operations (automated)")
    print("  2. Get a list of all Telugu text to translate manually")
    print("  3. Use an external translation API")
