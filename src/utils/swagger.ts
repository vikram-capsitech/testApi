import { Express, Request, Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';
import colors from "colors";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:'Taut api docs',
      version
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []        
      }
    ]
  },
  apis: ['./src/routes.*.ts']
}

export const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: Express, port: number) => {
  
  // Docs in JSON format
  app.get('api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  })

  console.log(colors.bgGreen.bold(`Docs available at http://localhost:${port}/api-docs`))
}

export default swaggerDocs;