import { Request, Response, NextFunction } from 'express';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Colores de texto
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Colores de fondo
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

// Función para obtener color según el método HTTP
const getMethodColor = (method: string): string => {
  switch (method) {
    case 'GET':
      return colors.green;
    case 'POST':
      return colors.blue;
    case 'PUT':
    case 'PATCH':
      return colors.yellow;
    case 'DELETE':
      return colors.red;
    default:
      return colors.white;
  }
};

// Función para obtener color según el status code
const getStatusColor = (statusCode: number): string => {
  if (statusCode >= 200 && statusCode < 300) {
    return colors.green;
  } else if (statusCode >= 300 && statusCode < 400) {
    return colors.cyan;
  } else if (statusCode >= 400 && statusCode < 500) {
    return colors.yellow;
  } else if (statusCode >= 500) {
    return colors.red;
  }
  return colors.white;
};

// Función para formatear el tiempo de respuesta
const formatResponseTime = (ms: number): string => {
  if (ms < 100) {
    return `${colors.green}${ms.toFixed(2)}ms${colors.reset}`;
  } else if (ms < 500) {
    return `${colors.yellow}${ms.toFixed(2)}ms${colors.reset}`;
  } else {
    return `${colors.red}${ms.toFixed(2)}ms${colors.reset}`;
  }
};

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Capturar información de la request
  const method = req.method;
  const url = req.originalUrl || req.url;
  const userAgent = req.get('user-agent') || 'Unknown';
  const ip = req.ip || req.socket.remoteAddress || 'Unknown';
  
  // Log de la request entrante (opcional, comentar si es muy verboso)
  console.log(
    `${colors.dim}[${new Date().toISOString()}]${colors.reset} ` +
    `${getMethodColor(method)}${method}${colors.reset} ` +
    `${colors.cyan}${url}${colors.reset} ` +
    `${colors.dim}from ${ip}${colors.reset}`
  );

  // Interceptar el método res.json() para loguear la respuesta
  const originalJson = res.json.bind(res);
  res.json = function(body: any): Response {
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Log completo de la respuesta
    console.log(
      `${colors.dim}[${new Date().toISOString()}]${colors.reset} ` +
      `${getMethodColor(method)}${method}${colors.reset} ` +
      `${colors.cyan}${url}${colors.reset} ` +
      `${getStatusColor(statusCode)}${statusCode}${colors.reset} ` +
      `${formatResponseTime(responseTime)} ` +
      `${colors.dim}${userAgent.substring(0, 50)}${colors.reset}`
    );
    
    // Si hay error, mostrar más detalles
    if (statusCode >= 400) {
      console.log(
        `${colors.red}Error Details:${colors.reset} ` +
        `${JSON.stringify(body, null, 2)}`
      );
    }

    return originalJson(body);
  };

  next();
};

// Middleware para loguear errores no capturados
export const errorLoggerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(
    `${colors.bgRed}${colors.white} ERROR ${colors.reset} ` +
    `${colors.red}${err.name}: ${err.message}${colors.reset}`
  );
  console.error(`${colors.dim}Stack trace:${colors.reset}`);
  console.error(err.stack);
  console.error(
    `${colors.dim}Request: ${req.method} ${req.originalUrl}${colors.reset}`
  );
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};