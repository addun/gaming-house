import { Logger } from '@nestjs/common';
import { Engine } from './engine.models';

class EngineManager {
  private engines: Engine[] = [];

  public register(engineName: string): void {
    this.getOrCreateEngine(engineName);
  }

  public addSignal(engineName: string, signal: string): void {
    const engine = this.getOrCreateEngine(engineName);
    engine.signals.push(signal);
  }

  public addAction(engineName: string, action: string): void {
    const engine = this.getOrCreateEngine(engineName);
    engine.actions.push(action);
  }

  public getEngine(engineName: string): Engine {
    const engine = this.engines.find(e => e.name === engineName);
    if (typeof engine === 'undefined') {
      throw new Error(`Cannot find engine ${engineName}`);
    }
    return engine;
  }

  private getOrCreateEngine(engineName: string): Engine {
    try {
      return this.getEngine(engineName);
    } catch {
      const engine = {
        name: engineName,
        actions: [],
        signals: [],
      };
      this.engines.push(engine);
      return engine;
    }
  }
}

export const engineManager = new EngineManager();

const logger = new Logger(EngineManager.name);

export const GameEngine = (): ClassDecorator => {
  return target => {
    engineManager.register(target.name);
    logger.log(`${target.name} engine registered`);
  };
};

export const Action = (): MethodDecorator => {
  return (target, propertyKey) => {
    engineManager.addAction(target.constructor.name, propertyKey.toString());
    logger.log(
      `Registered Action -> ${Action.name.toLowerCase()} <- ${propertyKey.toString()} in ${
        target.constructor.name
      } engine`,
    );
  };
};

export const Output = (): PropertyDecorator => {
  return (target, propertyKey) => {
    engineManager.addSignal(target.constructor.name, propertyKey.toString());
    logger.log(
      `Registered Output ${propertyKey.toString()} in ${
        target.constructor.name
      } engine`,
    );
  };
};
