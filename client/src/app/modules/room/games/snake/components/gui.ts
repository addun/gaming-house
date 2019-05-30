import { Point } from './point';

interface TilePosition {
  center: Point;
  corner: {
    topRight: Point;
    topLeft: Point;
    bottomRight: Point;
    bottomLeft: Point;
  };
  width: number;
  height: number;
}

const countMetaPositions = (
  center: Point,
  width: number,
  height: number,
): TilePosition => {
  const startX = center.x - width / 2;
  const endX = center.x + width / 2;
  const topY = center.y - height / 2;
  const bottomY = center.y + height / 2;
  return {
    center,
    height,
    width,
    corner: {
      topRight: {
        x: endX,
        y: topY,
      },
      topLeft: {
        x: startX,
        y: topY,
      },
      bottomRight: {
        x: endX,
        y: bottomY,
      },
      bottomLeft: {
        x: startX,
        y: bottomY,
      },
    },
  };
};

export class GUI {
  public height: number;
  public width: number;
  private tiles: TilePosition[][] = [];

  public constructor(
    private ctx: CanvasRenderingContext2D,
    public config = {
      size: {
        y: 25,
        x: 25,
      },
    },
  ) {
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.setup();
  }

  public fillTile(position: Point, color: string = '#000') {
    this.ctx.fillStyle = color;
    const tileToDraw = this.tiles[position.x][position.y];
    this.ctx.fillRect(
      tileToDraw.corner.topLeft.x,
      tileToDraw.corner.topLeft.y,
      tileToDraw.width,
      tileToDraw.height,
    );
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private setup() {
    const stepX = this.width / this.config.size.x;
    const stepY = this.height / this.config.size.y;
    const distanceToMiddleX = stepX / 2;
    const distanceToMiddleY = stepY / 2;
    for (let currentPositionX = 0, i = 0; i < this.config.size.x; ++i) {
      const x = currentPositionX + distanceToMiddleX;
      const tileY: TilePosition[] = [];
      for (let currentPositionY = 0, j = 0; j < this.config.size.y; ++j) {
        const y = currentPositionY + distanceToMiddleY;
        tileY.push(countMetaPositions({ x, y }, stepX, stepY));
        currentPositionY += stepY;
      }
      this.tiles.push(tileY);
      currentPositionX += stepX;
    }
  }
}
