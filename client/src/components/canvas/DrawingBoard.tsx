import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";

type Tool = "pen" | "eraser";

interface Stroke {
  tool: Tool;
  color: string;
  size: number;
  points: number[];
}

interface DrawingBoardProps {
  onExport: (dataUrl: string) => void;
}

export function DrawingBoard({ onExport }: DrawingBoardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 600, height: 360 });
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentTool, setCurrentTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.width * (9 / 16);
      setSize({ width, height: Math.min(height, 420) });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startStroke = (pos: { x: number; y: number }) => {
    setIsDrawing(true);
    setStrokes((prev) => [
      ...prev,
      {
        tool: currentTool,
        color,
        size: brushSize,
        points: [pos.x, pos.y],
      },
    ]);
  };

  const addPoint = (pos: { x: number; y: number }) => {
    if (!isDrawing) return;
    setStrokes((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      const updated = {
        ...last,
        points: [...last.points, pos.x, pos.y],
      };
      return [...prev.slice(0, -1), updated];
    });
  };

  const handlePointerDown = (e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;
    startStroke(pos);
  };

  const handlePointerMove = (e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;
    addPoint(pos);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setStrokes([]);
  };

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleExport = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    onExport(uri);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentTool("pen")}
            className={`px-2 py-1 rounded-lg border ${
              currentTool === "pen"
                ? "bg-accent border-accent text-textPrimary"
                : "bg-background border-white/10 text-textSecondary"
            }`}
          >
            Кисть
          </button>
          <button
            type="button"
            onClick={() => setCurrentTool("eraser")}
            className={`px-2 py-1 rounded-lg border ${
              currentTool === "eraser"
                ? "bg-accent border-accent text-textPrimary"
                : "bg-background border-white/10 text-textSecondary"
            }`}
          >
            Ластик
          </button>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-7 w-7 rounded-md border border-white/10 bg-transparent p-0"
          />
          <input
            type="range"
            min={2}
            max={20}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            className="px-2 py-1 rounded-lg bg-background border border-white/10 text-textSecondary"
          >
            Отменить
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-2 py-1 rounded-lg bg-background border border-white/10 text-textSecondary"
          >
            Очистить
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg bg-accent text-textPrimary text-xs font-semibold shadow-card"
          >
            Сохранить рисунок
          </button>
        </div>
      </div>

      <div ref={containerRef} className="w-full rounded-2xl bg-background border border-white/10 overflow-hidden">
        <Stage
          width={size.width}
          height={size.height}
          ref={stageRef}
          onMouseDown={handlePointerDown}
          onMousemove={handlePointerMove}
          onMouseup={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <Layer>
            <Rect width={size.width} height={size.height} fill="#1a0f2b" />
            {strokes.map((stroke, i) => (
              <Line
                key={i}
                points={stroke.points}
                stroke={stroke.tool === "eraser" ? "#1a0f2b" : stroke.color}
                strokeWidth={stroke.size}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={stroke.tool === "eraser" ? "destination-out" : "source-over"}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

