import React, { useState } from "react";
// import Konva from "konva";
import { Stage, Layer, Group, Line, Rect, Circle } from "react-konva";

const Canva = () => {
  const [points, setPoints] = useState([]);
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const getMousePos = stage => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  const handleClick = event => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    if (isFinished) {
      return;
    }
    if (isMouseOverStartPoint && points.length >= 3) {
      setIsFinished(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = event => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    setCurMousePos(mousePos);
  };

  const handleMouseOverStartPoint = event => {
    if (isFinished || points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setIsMouseOverStartPoint(true);
  };

  const handleMouseOutStartPoint = event => {
    event.target.scale({ x: 1, y: 1});
    setIsMouseOverStartPoint(false);
  };

  const handleDragStartPoint = event => {
    console.log("start", event);
  };

  const handleDragMovePoint = event => {
    const index = event.target.index - 1;
    const pos = [event.target.attrs.x, event.target.attrs.y];

    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  const handleDragOutPoint = event => {
    console.log("end", event);
  };

  const flattenedPoints = points
    .concat(isFinished ? [] : curMousePos)
    .reduce((a, b) => a.concat(b), []);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleClick}
      onMouseMove={handleMouseMove}
      draggable={true}
    >
      <Layer>
        <Line
          points={flattenedPoints}
          stroke="black"
          strokeWidth={2}
          closed={isFinished}
          lineJoin="round"
        />
        {points.map((point, index) => {
          const width = 8;
          const x = point[0];
          const y = point[1];
          const startPointAttr =
            index === 0
              ? {
                  hitStrokeWidth: 20,
                  onMouseOver: handleMouseOverStartPoint,
                  onMouseOut: handleMouseOutStartPoint
                }
              : null;
          return (
            <Circle
              key={index}
              x={x}
              y={y}
              width={width}
              height={width}
              fill="red"
              stroke="blue"
              strokeWidth={3}
              onDragStart={handleDragStartPoint}
              onDragMove={handleDragMovePoint}
              onDragEnd={handleDragOutPoint}
              draggable
              {...startPointAttr}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default Canva;


