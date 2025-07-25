from atc_transcriber import ATCTranscriber

# Simple example - just transcribe a file
def quick_test():
    transcriber = ATCTranscriber()
    
    # Replace with your audio file
    audio_file = "atc-test-1_chunk_04 copy.wav"  # Put your audio file here
    
    print("Transcribing...")
    result = transcriber.transcribe_audio_file(audio_file)
    print(f"Result: {result}")

if __name__ == "__main__":
    quick_test() 