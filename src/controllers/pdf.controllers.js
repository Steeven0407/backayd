import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from "../db.js";
import databaseError from "../middlewares/error.js";
import PDFDocument from 'pdfkit';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import os from 'os';


export const generarInforme = async (req, res) => {
  try {
      // Consulta para obtener la cantidad de tipos de documento con su respectivo nombre y cantidad de proyectos en cada uno
      console.log('Ejecutando consulta de tipos de documento...');
      const [tipoDocumentoCantidad] = await pool.query(`
      SELECT td.nombre, COUNT(d.id) AS cantidadDeProyectos
      FROM tipodocumento td
      LEFT JOIN documento d ON td.id = d.tipodocumento
      GROUP BY td.nombre
    `);

      // Consulta para obtener la cantidad total de proyectos
      console.log('Ejecutando consulta de cantidad total de proyectos...');
      const [totalProyectos] = await pool.query(`
      SELECT COUNT(*) AS cantidadTotalDeProyectos
      FROM documento
    `);

      // Consulta para obtener la cantidad de proyectos en los últimos 10 días
      console.log('Ejecutando consulta de proyectos en los últimos 10 días...');
      const [proyectosUltimos10Dias] = await pool.query(`
      SELECT COUNT(*) AS cantidadDeProyectosEnLosUltimos10Dias
      FROM documento
      WHERE fechaSubida >= CURDATE() - INTERVAL 10 DAY
    `);

      // Consulta para obtener la cantidad de solicitudes
      console.log('Ejecutando consulta de solicitudes...');
      const [totalSolicitudes] = await pool.query(`
      SELECT COUNT(*) AS cantidadDeSolicitudes
      FROM solicitud
    `);

    console.log('Ejecutando consulta de vistas...');
    const [totalVistas] = await pool.query(`
    SELECT cantidadVistas FROM contadorvistas LIMIT 1
`);

      // Crear un nuevo documento PDF
      console.log('Creando documento PDF...');
      const doc = new PDFDocument();
      const numeroAleatorio = crypto.randomInt(1, 1000); // Generar un número aleatorio entre 1 y 1000
      const fecha = new Date().toISOString().slice(0, 10); // Obtener la fecha actual en formato YYYY-MM-DD
      const filePath = join(os.homedir(), os.platform() === 'win32' ? 'Downloads' : 'Descargas', `informe_${fecha}_${numeroAleatorio}.pdf`);
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // Obtener la ruta de la imagen logo.jpg
      const currentFileUrl = import.meta.url;
      const currentFilePath = fileURLToPath(currentFileUrl);
      const imgFolderPath = join(dirname(currentFilePath), '..', 'img');
      const imagePath = join(imgFolderPath, 'logo.jpg');

      // Agregar la imagen en el encabezado
      doc.image(imagePath, {
          fit: [50, 50], // Ajusta el tamaño de la imagen según tus necesidades
          align: 'left'
      });

      // Título del encabezado
      doc.fontSize(20).text('Repositorio digital de ingeniería de sistemas', { align: 'center' });
      doc.moveDown(2);

      // Título del informe
      doc.fontSize(20).text('Informe de Proyectos y Solicitudes', { align: 'center' });
      doc.moveDown();

      // Cantidad de tipos de documento con su respectivo nombre y cantidad de proyectos en cada uno
      doc.fontSize(16).text('Tipos de Documento y Cantidad de Proyectos');
      doc.fontSize(16).text(' ');
      tipoDocumentoCantidad.forEach((tipo) => {
          doc.fontSize(12).text(`${tipo.nombre}: ${tipo.cantidadDeProyectos} proyectos`);
      });

      doc.moveDown();
      // Cantidad total de proyectos
      doc.fontSize(16).text('Cantidad Total de Proyectos');
      doc.fontSize(12).text(`${totalProyectos[0].cantidadTotalDeProyectos} proyectos`);

      doc.moveDown();
      // Cantidad de proyectos en los últimos 10 días
      doc.fontSize(16).text('Cantidad de Proyectos en los Últimos 10 Días');
      doc.fontSize(12).text(`${proyectosUltimos10Dias[0].cantidadDeProyectosEnLosUltimos10Dias} proyectos`);

      doc.moveDown();
      // Cantidad de solicitudes
      doc.fontSize(16).text('Cantidad de Solicitudes');
      doc.fontSize(12).text(`${totalSolicitudes[0].cantidadDeSolicitudes} solicitudes`);

      doc.moveDown();
      // Cantidad de vistas
      doc.fontSize(16).text('Cantidad de vistas');
      doc.fontSize(12).text(`${totalVistas[0].cantidadVistas} vistas`);


      // Finalizar el documento
      doc.end();

      writeStream.on('finish', () => {
          console.log('Archivo PDF guardado en la carpeta de descargas del equipo.');
          res.status(200).json({ message: 'Informe generado y guardado en la carpeta de descargas.' });
      });

      writeStream.on('error', (error) => {
          console.error('Error al guardar el archivo PDF:', error);
          res.status(500).json({ message: 'Error interno del servidor al guardar el archivo PDF' });
      });

  } catch (error) {
      console.error('Error al generar informe:', error);

      // Manejo genérico de otros errores de base de datos
      const dbError = new Error('Error interno del servidor al realizar la consulta');
      return res.status(500).json({ message: dbError.message });
  }
};