import torch
import librosa
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import numpy as np
import warnings
from colorama import init, Fore, Back, Style
import textwrap

# Initialize colorama
init(autoreset=True)

# Suppress transformers warnings
warnings.filterwarnings("ignore", category=UserWarning, module="transformers")
import logging
logging.getLogger("transformers").setLevel(logging.ERROR)

class ATCTranscriber:
    def __init__(self):
        """Initialize the ATC transcriber with the fine-tuned model"""
        print("Loading ATC-tuned Whisper model...")
        self.model_name = "jacktol/whisper-medium.en-fine-tuned-for-ATC"
        
        # Load the processor and model
        self.processor = WhisperProcessor.from_pretrained(self.model_name)
        self.model = WhisperForConditionalGeneration.from_pretrained(self.model_name)
        
        # Check if CUDA is available
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = self.model.to(self.device)
        print(f"Model loaded on {self.device}")
        
        self.sample_rate = 16000  # Whisper expects 16kHz
        
    def transcribe_audio_file(self, audio_path):
        """
        Transcribe a single audio file
        
        Args:
            audio_path (str): Path to the audio file
            
        Returns:
            str: Transcribed text
        """
        try:
            # Load audio
            audio, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Process the audio
            inputs = self.processor(
                audio, 
                sampling_rate=self.sample_rate, 
                return_tensors="pt"
            )
            
            # Move to device
            input_features = inputs.input_features.to(self.device)
            
            # Generate transcription
            with torch.no_grad():
                predicted_ids = self.model.generate(input_features)
            
            # Decode the transcription
            transcription = self.processor.batch_decode(
                predicted_ids, 
                skip_special_tokens=True
            )[0]
            
            return transcription.strip()
            
        except Exception as e:
            return f"Error transcribing audio: {str(e)}"

# Global transcriber instance - loads once and reuses forever
_global_transcriber = None

def get_transcriber():
    """Get or create the global transcriber instance"""
    global _global_transcriber
    if _global_transcriber is None:
        _global_transcriber = ATCTranscriber()
    return _global_transcriber

def transcribe_file(audio_file, print_result=True):
    """Simple function to transcribe a single file using the global transcriber"""
    transcriber = get_transcriber()
    transcription = transcriber.transcribe_audio_file(audio_file)
    
    if print_result:
        print_transcription(transcription, audio_file)
    
    return transcription

def print_transcription(transcription, audio_file=None):
    """Beautifully format and print the transcription result"""
    # Terminal width for formatting
    terminal_width = 80
    
    print("\n" + "="*terminal_width)
    print(f"{Fore.CYAN}🎤 ATC TRANSCRIPTION RESULT{Style.RESET_ALL}".center(terminal_width))
    print("="*terminal_width)
    
    if audio_file:
        print(f"{Fore.YELLOW}📁 File: {Style.BRIGHT}{audio_file}{Style.RESET_ALL}")
        print("-"*terminal_width)
    
    # Wrap the transcription text nicely
    wrapped_text = textwrap.fill(transcription, width=terminal_width-6)
    
    print(f"{Fore.GREEN}📝 Transcription:{Style.RESET_ALL}")
    print()
    
    # Print each line with nice formatting
    for line in wrapped_text.split('\n'):
        print(f"   {Fore.WHITE}{Style.BRIGHT}{line}{Style.RESET_ALL}")
    
    print()
    print("="*terminal_width)
    print(f"{Fore.MAGENTA}✅ Transcription complete!{Style.RESET_ALL}".center(terminal_width))
    print("="*terminal_width + "\n")

if __name__ == "__main__":
    # Example usage
    audio_file = input("Enter audio file path: ")
    result = transcribe_file(audio_file)  # Will automatically print beautifully 