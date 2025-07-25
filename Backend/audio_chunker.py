import librosa
import soundfile as sf
import os
import math

def split_audio_into_chunks(input_file, chunk_duration=10, output_dir="chunks"):
    """
    Split an audio file into chunks of specified duration
    
    Args:
        input_file (str): Path to the input audio file
        chunk_duration (int): Duration of each chunk in seconds (default: 10)
        output_dir (str): Directory to save chunks (default: "chunks")
    
    Returns:
        list: List of chunk filenames created
    """
    try:
        # Load the audio file
        print(f"Loading {input_file}...")
        audio, sr = librosa.load(input_file, sr=None)  # Keep original sample rate
        print(f"✅ Audio loaded successfully!")
        
        # Get audio duration
        duration = len(audio) / sr
        print(f"Audio duration: {duration:.2f} seconds at {sr} Hz")
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Calculate number of chunks
        num_chunks = math.ceil(duration / chunk_duration)
        print(f"Creating {num_chunks} chunks of {chunk_duration} seconds each...")
        
        chunk_files = []
        
        # Split into chunks
        for i in range(num_chunks):
            start_time = i * chunk_duration
            end_time = min((i + 1) * chunk_duration, duration)
            
            # Convert to sample indices
            start_sample = int(start_time * sr)
            end_sample = int(end_time * sr)
            
            # Extract chunk
            chunk = audio[start_sample:end_sample]
            
            # Generate output filename
            base_name = os.path.splitext(os.path.basename(input_file))[0]
            chunk_filename = f"{base_name}_chunk_{i+1:02d}.wav"
            chunk_path = os.path.join(output_dir, chunk_filename)
            
            # Save chunk
            sf.write(chunk_path, chunk, sr)
            chunk_files.append(chunk_filename)
            
            actual_duration = len(chunk) / sr
            print(f"Saved {chunk_filename} - Duration: {actual_duration:.2f}s")
        
        print(f"\n✅ Successfully created {len(chunk_files)} chunks in '{output_dir}' directory")
        return chunk_files
        
    except Exception as e:
        print(f"❌ Error processing audio: {str(e)}")
        return []

def main():
    # Split atc-test-1.mp3 into 10-second chunks
    input_file = "atc-test-1.mp3"
    
    if not os.path.exists(input_file):
        print(f"❌ Error: {input_file} not found!")
        print("Files in current directory:")
        for f in os.listdir("."):
            if f.endswith((".mp3", ".wav", ".m4a")):
                print(f"  - {f}")
        return
    
    file_size = os.path.getsize(input_file) / (1024 * 1024)  # MB
    print(f"File size: {file_size:.2f} MB")
    
    chunks = split_audio_into_chunks(input_file, chunk_duration=10)
    
    if chunks:
        print(f"\nCreated chunks:")
        for chunk in chunks:
            print(f"  - {chunk}")
    else:
        print("No chunks were created due to errors.")

if __name__ == "__main__":
    main() 