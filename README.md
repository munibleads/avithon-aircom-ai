# ATC Audio Transcriber

Uses the fine-tuned Whisper model `jacktol/whisper-medium.en-fine-tuned-for-ATC` to transcribe Air Traffic Control audio.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the transcriber:
```bash
python atc_transcriber.py
```

## Usage

### Transcribe Audio File
```python
from atc_transcriber import ATCTranscriber

transcriber = ATCTranscriber()
result = transcriber.transcribe_audio_file("your_audio.wav")
print(result)
```

### Live Transcription
```python
transcriber = ATCTranscriber()
transcriber.start_live_transcription()
# Press Ctrl+C to stop
```

## Audio Formats Supported
- WAV, MP3, FLAC, M4A, etc. (anything librosa can load)
- Automatically converts to 16kHz mono (required by Whisper) 