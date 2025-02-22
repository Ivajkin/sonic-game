import os
from moviepy.editor import VideoFileClip
import numpy as np
import json

def extract_audio_data(video_path):
    """Extract audio data from video file and convert to frequency data."""
    try:
        # Load video file
        video = VideoFileClip(video_path)
        
        # Extract audio
        audio = video.audio
        
        # Get audio data
        audio_data = audio.to_soundarray()
        
        # Convert to mono if stereo
        if len(audio_data.shape) > 1:
            audio_data = np.mean(audio_data, axis=1)
        
        # Get sample rate
        sample_rate = audio.fps
        
        # Calculate frequencies using FFT
        frequencies = []
        chunk_size = int(sample_rate / 10)  # 100ms chunks
        
        for i in range(0, len(audio_data), chunk_size):
            chunk = audio_data[i:i + chunk_size]
            if len(chunk) == chunk_size:
                fft_data = np.fft.fft(chunk)
                freqs = np.fft.fftfreq(len(fft_data)) * sample_rate
                magnitude = np.abs(fft_data)
                
                # Find dominant frequency
                peak_freq = freqs[np.argmax(magnitude)]
                if peak_freq > 20 and peak_freq < 20000:  # Audible range
                    frequencies.append(float(peak_freq))
        
        # Create song data structure
        song_data = {
            "bpm": estimate_bpm(audio_data, sample_rate),
            "melody": clean_frequencies(frequencies[::4]),  # Every 4th frequency for melody
            "bassline": clean_frequencies([f/2 for f in frequencies[::8]]),  # Lower octave, every 8th
            "rhythm": generate_rhythm_pattern(audio_data, chunk_size),
            "lead": clean_frequencies([f*2 for f in frequencies[::16]])  # Higher octave, every 16th
        }
        
        # Save to JSON file
        output_path = "song_data.json"
        with open(output_path, 'w') as f:
            json.dump(song_data, f, indent=2)
        
        print(f"Audio data extracted and saved to {output_path}")
        return song_data
        
    except Exception as e:
        print(f"Error processing video: {e}")
        return None
    finally:
        if 'video' in locals():
            video.close()

def clean_frequencies(freqs):
    """Clean and normalize frequency data."""
    # Remove any non-finite values
    freqs = [f for f in freqs if np.isfinite(f)]
    
    # Limit to reasonable range
    freqs = [min(max(f, 20), 20000) for f in freqs]
    
    # Ensure we have enough data
    while len(freqs) < 32:
        freqs.extend(freqs[:32-len(freqs)])
    
    return freqs[:32]  # Return first 32 frequencies

def estimate_bpm(audio_data, sample_rate):
    """Estimate BPM from audio data."""
    # Simple BPM detection using amplitude peaks
    chunk_size = int(sample_rate / 2)  # 0.5s chunks
    peaks = []
    
    for i in range(0, len(audio_data), chunk_size):
        chunk = audio_data[i:i + chunk_size]
        if len(chunk) == chunk_size:
            peaks.append(np.max(np.abs(chunk)))
    
    # Count significant peaks
    threshold = np.mean(peaks) + np.std(peaks)
    significant_peaks = sum(1 for p in peaks if p > threshold)
    
    # Calculate BPM (peaks per minute)
    duration_minutes = len(audio_data) / sample_rate / 60
    estimated_bpm = significant_peaks / duration_minutes
    
    # Round to reasonable BPM range
    return min(max(int(estimated_bpm), 60), 180)

def generate_rhythm_pattern(audio_data, chunk_size):
    """Generate rhythm pattern from audio amplitude."""
    pattern = []
    
    for i in range(0, len(audio_data), chunk_size):
        chunk = audio_data[i:i + chunk_size]
        if len(chunk) == chunk_size:
            amplitude = np.max(np.abs(chunk))
            # Normalize to 0-1 range
            pattern.append(float(amplitude / np.max(np.abs(audio_data))))
    
    # Clean and normalize pattern
    pattern = [min(max(p, 0), 1) for p in pattern]
    
    # Ensure we have enough data
    while len(pattern) < 24:
        pattern.extend(pattern[:24-len(pattern)])
    
    return pattern[:24]  # Return first 24 rhythm values

if __name__ == "__main__":
    video_path = "Screen Recording 2025-02-23 at 2.31.36 AM.mov"
    
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at {video_path}")
    else:
        song_data = extract_audio_data(video_path)
        if song_data:
            print("Successfully extracted audio data!")
            print(f"BPM: {song_data['bpm']}")
            print(f"Number of melody notes: {len(song_data['melody'])}")
            print(f"Number of bassline notes: {len(song_data['bassline'])}")
            print(f"Number of rhythm patterns: {len(song_data['rhythm'])}")
            print(f"Number of lead notes: {len(song_data['lead'])}") 