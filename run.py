import subprocess
import sys
import time
import webbrowser
import os

def main():
    print("=" * 60)
    print("        Water-Energy Nexus AI Portal - Launcher")
    print("=" * 60)

    # Resolve paths relative to this script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "Backend")
    frontend_dir = os.path.join(base_dir, "Frontend")

    print("[1/3] Launching Flask Backend on port 5000...")
    backend_proc = subprocess.Popen(
        [sys.executable, "app.py"],
        cwd=backend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )

    print("[2/3] Launching Frontend Server on port 8000...")
    frontend_proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", "8000", "--directory", frontend_dir],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    print("[3/3] Launching Web Browser...")
    time.sleep(3)  # Give backend a moment to start loading
    webbrowser.open("http://127.0.0.1:8000/index.html")

    print("\nSystem running! Press Ctrl+C to shut down both servers.")
    print("-" * 60)

    try:
        # Keep launcher running and stream backend logs to console
        while True:
            line = backend_proc.stdout.readline()
            if line:
                print(f"[Backend] {line.strip()}")
            elif backend_proc.poll() is not None:
                print("[WARNING] Backend process exited unexpectedly.")
                break
            time.sleep(0.1)
    except KeyboardInterrupt:
        print("\n[INFO] Shutting down servers gracefully...")
    finally:
        # Graceful shutdown of subprocesses
        backend_proc.terminate()
        frontend_proc.terminate()
        try:
            backend_proc.wait(timeout=3)
            frontend_proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            backend_proc.kill()
            frontend_proc.kill()
        print("[SUCCESS] All servers stopped.")

if __name__ == "__main__":
    main()
