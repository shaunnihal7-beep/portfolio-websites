(() => {
  // ==========================================================================
  // Virtual Files & Mock Code Database
  // ==========================================================================
  const FILE_CONTENTS = {
    "App.js": `import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { sceneState } from './three/sceneState';
import ParticleField from './three/ParticleField';
import Core from './three/Core';
import gsap from 'gsap';

export default function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Neural flow init
    console.log("Orchestrator online. Scanning network vectors...");
    gsap.to(sceneState, {
      morph: 1.0,
      duration: 2.4,
      scrollTrigger: {
        trigger: "#thesis",
        scrub: true
      }
    });
  }, []);

  return (
    <div className="neural-viewport" ref={containerRef}>
      <Canvas camera={{ fov: 45, position: [0, 0, 8] }}>
        <ParticleField count={8500} />
        <Core opacity={0.8} />
      </Canvas>
    </div>
  );
}`,
    "index.css": `:root {
  --neon-cyan: #06b6d4;
  --neon-green: #10b981;
  --cyber-black: #05070f;
  --text-main: #e0e7ff;
}

body {
  margin: 0;
  background-color: var(--cyber-black);
  color: var(--text-main);
  font-family: 'Space Mono', monospace;
  overflow: hidden;
}`,
    "main.js": `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}`,
    "vite.config.js": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    target: 'es2020',
    cssCodeSplit: false
  }
});`,
    "package.json": `{
  "name": "neural-hud-project",
  "version": "1.2.6",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@react-three/fiber": "^8.17.10",
    "gsap": "^3.12.7",
    "react": "^18.3.1",
    "three": "^0.170.0"
  },
  "devDependencies": {
    "vite": "^5.4.11",
    "vite-plugin-singlefile": "^2.0.1"
  }
}`,
    "manifest.json": `{
  "hud_version": "1.2.6",
  "theme": "cyberpunk-hud",
  "primary_glow": "#06b6d4",
  "status_channel": "active",
  "agent_diagnostics": {
    "temperature": 0.2,
    "confidence_threshold": 0.94
  }
}`,
    "README.md": `# Claude Code — Neural HUD Workspace

Welcome to the Multi-Agent Neural HUD Workspace simulation. This interface provides real-time diagnostic feeds, collapsible file hierarchies, and a simulated shell loop.

## Console Commands:
- \`help\` : Show available shell commands.
- \`status\` : Perform a diagnostics check.
- \`matrix\` : Toggle matrix rain visualization in the editor.
- \`files\` : List active project workspace files.
- \`clear\` : Clear shell output.
- \`joke\` : Request a developer joke.
- \`weather\` : Run simulated weather report.
- \`run [filename]\` : Run file execution sequence.`
  };

  const TREE_DATA = [
    {
      name: "src",
      type: "folder",
      children: [
        { name: "App.js", type: "file" },
        { name: "index.css", type: "file" },
        { name: "main.js", type: "file" }
      ]
    },
    {
      name: "config",
      type: "folder",
      children: [
        { name: "vite.config.js", type: "file" },
        { name: "package.json", type: "file" }
      ]
    },
    { name: "manifest.json", type: "file" },
    { name: "README.md", type: "file" }
  ];

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const fileTree = document.getElementById("file-tree");
  const tabFilename = document.getElementById("tab-filename");
  const editorCode = document.getElementById("editor-code");
  const editorLines = document.getElementById("editor-lines");
  const terminalHistory = document.getElementById("terminal-history");
  const terminalForm = document.getElementById("terminal-form");
  const terminalInput = document.getElementById("terminal-input");
  const terminalClear = document.getElementById("terminal-clear");
  const terminalBody = document.getElementById("terminal-body");
  const hudClock = document.getElementById("hud-clock");
  const hudDate = document.getElementById("hud-date");
  const agentActivityFeed = document.getElementById("agent-activity-feed");
  const matrixCanvas = document.getElementById("matrix-canvas");

  const telemetryPing = document.getElementById("telemetry-ping");
  const telemetryMem = document.getElementById("telemetry-mem");
  const telemetryCpu = document.getElementById("telemetry-cpu");

  // ==========================================================================
  // File Explorer Renderer
  // ==========================================================================
  function createFileTreeHTML(nodes) {
    return nodes.map(node => {
      if (node.type === "folder") {
        return `
          <li class="tree-node tree-folder">
            <div class="tree-label">
              <span class="tree-arrow"></span>
              <span class="tree-icon">📁</span>
              <span class="tree-name">${node.name}</span>
            </div>
            <ul class="tree-children">
              ${createFileTreeHTML(node.children)}
            </ul>
          </li>
        `;
      } else {
        return `
          <li class="tree-node tree-file-item" data-file="${node.name}">
            <div class="tree-label">
              <span class="tree-icon">📄</span>
              <span class="tree-name">${node.name}</span>
            </div>
          </li>
        `;
      }
    }).join("");
  }

  function initExplorer() {
    fileTree.innerHTML = createFileTreeHTML(TREE_DATA);

    // Setup folder toggle handlers
    document.querySelectorAll(".tree-folder").forEach(folder => {
      const label = folder.querySelector(".tree-label");
      label.addEventListener("click", () => {
        folder.classList.toggle("open");
      });
    });

    // Setup file load handlers
    document.querySelectorAll(".tree-file-item").forEach(fileItem => {
      fileItem.addEventListener("click", () => {
        // Clear active class from all
        document.querySelectorAll(".tree-label").forEach(l => l.classList.remove("active"));
        fileItem.querySelector(".tree-label").classList.add("active");

        const fileName = fileItem.getAttribute("data-file");
        loadCodeFile(fileName);
      });
    });
  }

  function loadCodeFile(name) {
    const content = FILE_CONTENTS[name] || "";
    tabFilename.querySelector(".tab-name").innerText = name;
    
    // Set text syntax text in tab action
    const syntaxLabel = document.querySelector(".editor-syntax");
    if (syntaxLabel) {
      if (name.endsWith(".json")) syntaxLabel.innerText = "JSON";
      else if (name.endsWith(".css")) syntaxLabel.innerText = "CSS";
      else if (name.endsWith(".md")) syntaxLabel.innerText = "Markdown";
      else syntaxLabel.innerText = "JavaScript";
    }

    // Populate editor code
    const escapedContent = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    editorCode.innerHTML = `<code>${escapedContent}</code>`;

    // Populate line numbers
    const lines = content.split("\n");
    let lineNumsHTML = "";
    for (let i = 1; i <= lines.length; i++) {
      lineNumsHTML += `<div>${i}</div>`;
    }
    editorLines.innerHTML = lineNumsHTML;
  }

  // ==========================================================================
  // Telemetry Metrics updates
  // ==========================================================================
  function updateClock() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    
    // Time format
    hudClock.innerText = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    // Date format
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    hudDate.innerText = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  function updateTelemetryStats() {
    // Random swinging within safe bounds
    const ping = Math.floor(10 + Math.random() * 8);
    const mem = (43.5 + Math.random() * 2.8).toFixed(1);
    const cpu = (14.2 + Math.random() * 12.5).toFixed(1);

    telemetryPing.innerText = `${ping}ms`;
    telemetryMem.innerText = `${mem}%`;
    telemetryCpu.innerText = `${cpu}%`;
  }

  // ==========================================================================
  // Matrix falling rain animation
  // ==========================================================================
  let matrixInterval = null;
  let isMatrixRainOn = false;

  function initMatrixRain() {
    const ctx = matrixCanvas.getContext("2d");
    
    // Resize handler
    const resizeCanvas = () => {
      const parent = matrixCanvas.parentElement;
      matrixCanvas.width = parent.clientWidth;
      matrixCanvas.height = parent.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const columns = Math.floor(matrixCanvas.width / 14) + 1;
    const yPositions = Array(columns).fill(0);

    function step() {
      // Clear with slight alpha fade
      ctx.fillStyle = "rgba(4, 6, 10, 0.05)";
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = "#06b6d4";
      ctx.font = "12px 'Space Mono', monospace";

      yPositions.forEach((y, index) => {
        // Random character
        const charCode = Math.floor(33 + Math.random() * 93);
        const char = String.fromCharCode(charCode);
        const x = index * 14;
        
        ctx.fillText(char, x, y);

        if (y > 100 + Math.random() * 10000) {
          yPositions[index] = 0;
        } else {
          yPositions[index] = y + 12;
        }
      });
    }

    window.toggleMatrixRain = () => {
      if (isMatrixRainOn) {
        clearInterval(matrixInterval);
        ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        matrixCanvas.style.opacity = "0";
        isMatrixRainOn = false;
        logAgentActivity("Matrix rain background disabled.");
      } else {
        matrixCanvas.style.opacity = "0.14";
        matrixInterval = setInterval(step, 45);
        isMatrixRainOn = true;
        logAgentActivity("Matrix rain background enabled.");
      }
      return isMatrixRainOn;
    };
  }

  // ==========================================================================
  // Agent Diagnostics log activity
  // ==========================================================================
  function logAgentActivity(msg, type = "SYSTEM") {
    const pad = (n) => String(n).padStart(2, '0');
    const now = new Date();
    const ts = `[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]`;
    
    let colorClass = "cyan-text";
    if (type === "AGENT") colorClass = "green-text";
    else if (type === "ALERT") colorClass = "gold-text";

    const item = document.createElement("div");
    item.className = "feed-item";
    item.innerHTML = `<span class="timestamp">${ts}</span> <span class="message"><strong class="${colorClass}">${type}</strong>: ${msg}</span>`;
    
    agentActivityFeed.appendChild(item);
    agentActivityFeed.scrollTop = agentActivityFeed.scrollHeight;
  }

  // Telemetry loop for active subagents logs
  const LOG_MESSAGES = [
    { msg: "Refactoring layout metrics vectors.", type: "AGENT" },
    { msg: "Adjusting neural temperature bounds.", type: "SYSTEM" },
    { msg: "Cleaned up unused canvas objects.", type: "ALERT" },
    { msg: "Analyzing model checkpoint paths.", type: "AGENT" },
    { msg: "Running baseline compiler checks.", type: "SYSTEM" }
  ];
  
  function startTelemetryFeed() {
    setInterval(() => {
      const choice = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      logAgentActivity(choice.msg, choice.type);
    }, 14000);
  }

  // ==========================================================================
  // Interactive Shell / Terminal Logic
  // ==========================================================================
  function writeToTerminal(text, isHTML = false) {
    const line = document.createElement("div");
    line.className = "term-line";
    if (isHTML) {
      line.innerHTML = text;
    } else {
      line.innerText = text;
    }
    terminalHistory.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Coding jokes database
  const JOKES = [
    "There are 10 types of people in this world: Those who understand binary, and those who don't.",
    "Why do programmers wear glasses? Because they can't C#.",
    "A SQL query goes into a bar, walks up to two tables and asks, 'Can I join you?'",
    "['hip', 'hip'] (hip hip array!)",
    "Why did the database administrator leave his wife? She had one-to-many relationships."
  ];

  // Simulated execution timelines
  function simulateFileRun(fileName) {
    writeToTerminal(`[INFO] Spawning child subagent thread for: ${fileName}`);
    writeToTerminal(`[INFO] Checking code vector dependencies...`);
    
    let step = 0;
    const steps = [
      () => writeToTerminal(`[INFO] Parsing import statements - COMPLETE`),
      () => writeToTerminal(`[DEBUG] Initializing local compiler buffer...`),
      () => writeToTerminal(`[DEBUG] Executing code simulation loop (Thread 1284)...`),
      () => {
        if (fileName === "App.js") {
          writeToTerminal(`[SUCCESS] WebGL particles counted: 8500`);
          writeToTerminal(`[SUCCESS] GSAP choreographies configured.`);
        } else if (fileName === "vite.config.js") {
          writeToTerminal(`[SUCCESS] Loaded vitePluginSinglefile successfully.`);
          writeToTerminal(`[SUCCESS] Output bundled into a single file dist.`);
        } else {
          writeToTerminal(`[SUCCESS] Executed main scripts successfully.`);
        }
      },
      () => {
        writeToTerminal(`[COMPLETE] Run completed. Thread returned 0 exit code.`);
        logAgentActivity(`Successful execution mockup of ${fileName}`, "AGENT");
      }
    ];

    const interval = setInterval(() => {
      if (step < steps.length) {
        steps[step]();
        step++;
      } else {
        clearInterval(interval);
      }
    }, 850);
  }

  // Weather report ASCII
  const WEATHER_REPORTS = [
    `WEATHER REPORT // NEURAL_GRID
   
       _  _      
     _(  )_( )_  
    (_   _    _) 
      (_) (__)   
     / / / / /   
     
    HEAVY DATA RAIN AT NODE US-EAST-4
    TEMP: 21°C // HUMIDITY: 92% // SCAN RATE: STABLE`,
    `WEATHER REPORT // NEURAL_GRID
   
       \\   /     
        .-.      
     ― (   ) ―   
        \`-\`      
       /   \\     
       
    CLEAR SOLAR RADIATION SECTOR
    TEMP: 35°C // WIND: NULL // VECTOR SHIFT: NONE`
  ];

  // Shell Command Controller
  function handleCommand(cmdString) {
    const args = cmdString.trim().split(" ");
    const cmd = args[0].toLowerCase();

    // Log terminal input to history
    writeToTerminal(`claude@hud:~$ ${cmdString}`);

    if (cmd === "") return;

    switch (cmd) {
      case "help":
        writeToTerminal(`AVAILABLE INTERACTIVE HUD COMMANDS:
  <span class="cyan-text">help</span>       : Show this commands index list.
  <span class="cyan-text">status</span>     : Query system diagnostics and load ratios.
  <span class="cyan-text">matrix</span>     : Toggle matrix falling symbols background in editor.
  <span class="cyan-text">files</span>      : List explorer workspace files.
  <span class="cyan-text">joke</span>       : Output a random developer programming joke.
  <span class="cyan-text">weather</span>    : Display simulated meteorology parameters.
  <span class="cyan-text">run [file]</span> : Execute code loop animation on explorer files.
  <span class="cyan-text">clear</span>      : Clear shell output log buffer.`, true);
        break;

      case "status":
        const ping = telemetryPing.innerText;
        const mem = telemetryMem.innerText;
        const cpu = telemetryCpu.innerText;
        writeToTerminal(`HUD DIAGNOSTICS & SYSTEM MATRIX CHECK:
  PING LATENCY : ${ping} (HEALTH: EXCELLENT)
  MEMORY LOAD  : ${mem} (CAPACITY: OPTIMAL)
  CPU RUN TIME : ${cpu} (THREADS: 3 ACTIVE)
  CORE NODE    : US-EAST-4
  AGENT MATRIX : CLAUDE CODE NEURAL HUD v1.2.6 (ONLINE)`);
        break;

      case "matrix":
        const active = window.toggleMatrixRain();
        writeToTerminal(`[SYSTEM] Matrix digital falling rain: ${active ? "ENABLED" : "DISABLED"}`);
        break;

      case "files":
        writeToTerminal(`WORKSPACE FILE MAP:
  - src/
    - App.js
    - index.css
    - main.js
  - config/
    - vite.config.js
    - package.json
  - manifest.json
  - README.md`);
        break;

      case "joke":
        const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
        writeToTerminal(`[HUMOR] ${randomJoke}`);
        break;

      case "weather":
        const report = WEATHER_REPORTS[Math.floor(Math.random() * WEATHER_REPORTS.length)];
        writeToTerminal(report);
        break;

      case "run":
        if (args.length < 2) {
          writeToTerminal(`[ERROR] Run requires a filename argument. Example: run App.js`);
        } else {
          const fileName = args[1];
          if (FILE_CONTENTS[fileName]) {
            simulateFileRun(fileName);
          } else {
            writeToTerminal(`[ERROR] File not found: "${fileName}". Type 'files' to see workspace map.`);
          }
        }
        break;

      case "clear":
        terminalHistory.innerHTML = "";
        break;

      default:
        writeToTerminal(`bash: ${cmd}: command not found. Type 'help' to see list of valid commands.`);
    }
  }

  function initTerminal() {
    terminalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = terminalInput.value;
      if (val !== "") {
        handleCommand(val);
        terminalInput.value = "";
      }
    });

    terminalClear.addEventListener("click", () => {
      terminalHistory.innerHTML = "";
    });
  }

  // ==========================================================================
  // Initialization entrypoint
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    // Explorer tree nodes & default file
    initExplorer();
    loadCodeFile("README.md");

    // Live clock and date
    updateClock();
    setInterval(updateClock, 1000);

    // Simulated telemetries updates
    setInterval(updateTelemetryStats, 3000);

    // Matrix background rain
    initMatrixRain();

    // Terminal shell handlers
    initTerminal();

    // Diagnostics thread feedback
    startTelemetryFeed();
  });
})();
