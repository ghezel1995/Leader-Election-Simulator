# Leader Election Lab

An interactive React + TypeScript educational simulator for leader election in distributed systems.

## Features
- Five simulated nodes with active/failed states
- Bully and Ring election strategies
- Click nodes to simulate failures and recovery
- Animated message labels and election event log
- Step-by-step election and automatic sequence controls
- Leader, node and message counters

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Notes
This is a browser-based simulation. It models node status and election messages; it does not create real network connections or distributed processes.
