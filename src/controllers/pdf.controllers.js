// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
import { pool } from "../db.js";
// import databaseError from "../middlewares/error.js";
// import PDFDocument from 'pdfkit';
// import crypto from 'crypto';
// import fs from 'fs';
// import path from 'path';
// import os from 'os';


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

    // Consulta para obtener la cantidad de vistas
    console.log('Ejecutando consulta de vistas...');
    const [totalVistas] = await pool.query(`
      SELECT cantidadVistas FROM contadorvistas LIMIT 1
    `);

    // Enviar los datos como respuesta JSON
    res.status(200).json({
      tipoDocumentoCantidad,
      cantidadTotalDeProyectos: totalProyectos[0].cantidadTotalDeProyectos,
      cantidadDeProyectosEnLosUltimos10Dias: proyectosUltimos10Dias[0].cantidadDeProyectosEnLosUltimos10Dias,
      cantidadDeSolicitudes: totalSolicitudes[0].cantidadDeSolicitudes,
      cantidadVistas: totalVistas[0].cantidadVistas
    });

  } catch (error) {
    console.error('Error al generar informe:', error);

    // Manejo genérico de otros errores de base de datos
    const dbError = new Error('Error interno del servidor al realizar la consulta');
    return res.status(500).json({ message: dbError.message });
  }
};