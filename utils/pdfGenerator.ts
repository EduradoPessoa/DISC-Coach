import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { User, DiscScore } from '../types';

interface PDFData {
  user: User;
  scores: DiscScore;
  insight: string;
  developmentPlan: any[];
}

export const generatePDF = (data: PDFData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Header Function
  const addHeader = (pageNum: number) => {
    // Logo / Title
    doc.setFillColor(30, 41, 59); // Slate 900
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('DISC Executive Profile', 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text('Confidential Report', pageWidth - 20, 25, { align: 'right' });
    
    // User Info Bar
    doc.setFillColor(241, 245, 249); // Slate 100
    doc.rect(0, 40, pageWidth, 15, 'F');
    doc.setTextColor(71, 85, 105); // Slate 600
    doc.setFontSize(10);
    
    const dateStr = new Date().toLocaleDateString('pt-BR');
    doc.text(`User: ${data.user.name}`, 20, 50);
    doc.text(`Date: ${dateStr}`, pageWidth - 20, 50, { align: 'right' });
  };

  // Footer Function
  const addFooter = (pageNum: number) => {
    const totalPages = doc.getNumberOfPages();
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    
    // Company Info
    const startY = pageHeight - 15;
    doc.text('PHOENYX TECNOLOGIA', 20, startY);
    doc.text('Site: https://www.phoenyx.com.br | Helpdesk: https://connect.phoenyx.com.br', 20, startY + 5);
    doc.text('Disc-Coach: https://disc.phoenyx.com.br | Whatsapp: +55 (19) 98221-0377', 20, startY + 10);
    
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 20, startY + 10, { align: 'right' });
  };

  // --- Content Page 1: Overview ---
  addHeader(1);
  
  let yPos = 70;

  // 1. DISC Profile Snapshot (Radar Chart)
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Profile Snapshot', 20, yPos);
  yPos += 10;

  // Radar Chart Logic
  // Center: (startX, startY)
  // Radius: r
  const cx = pageWidth / 2;
  const cy = yPos + 40;
  const r = 35; 
  const maxVal = 100;

  // Draw Background Grid (Spider Web)
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.1);
  
  // 4 Axes: Top (D), Right (I), Bottom (S), Left (C)
  // Angles: -90 (D), 0 (I), 90 (S), 180 (C)
  const axes = [
    { label: 'D', angle: -90, score: data.scores.D },
    { label: 'I', angle: 0, score: data.scores.I },
    { label: 'S', angle: 90, score: data.scores.S },
    { label: 'C', angle: 180, score: data.scores.C }
  ];

  // Draw Concentric Polygons (Grid)
  const levels = 5;
  for (let i = 1; i <= levels; i++) {
    const levelR = (r / levels) * i;
    const points: {x: number, y: number}[] = [];
    
    axes.forEach(axis => {
      const rad = (axis.angle * Math.PI) / 180;
      points.push({
        x: cx + levelR * Math.cos(rad),
        y: cy + levelR * Math.sin(rad)
      });
    });

    // Draw lines connecting points
    for (let j = 0; j < points.length; j++) {
      const p1 = points[j];
      const p2 = points[(j + 1) % points.length];
      doc.line(p1.x, p1.y, p2.x, p2.y);
    }
  }

  // Draw Axes Lines
  axes.forEach(axis => {
    const rad = (axis.angle * Math.PI) / 180;
    const endX = cx + r * Math.cos(rad);
    const endY = cy + r * Math.sin(rad);
    doc.line(cx, cy, endX, endY);
    
    // Draw Labels
    const labelR = r + 5;
    const labelX = cx + labelR * Math.cos(rad);
    const labelY = cy + labelR * Math.sin(rad);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(axis.label, labelX, labelY, { align: 'center', baseline: 'middle' });
  });

  // Draw Data Polygon
  doc.setDrawColor(79, 70, 229); // Indigo 600 border
  doc.setLineWidth(1);
  doc.setFillColor(79, 70, 229); // Indigo 600 fill
  
  const dataPoints: {x: number, y: number}[] = [];
  axes.forEach(axis => {
    const rad = (axis.angle * Math.PI) / 180;
    // Normalize score 0-100 to radius
    const scoreR = (axis.score / maxVal) * r;
    dataPoints.push({
      x: cx + scoreR * Math.cos(rad),
      y: cy + scoreR * Math.sin(rad)
    });
  });

  // Draw the filled polygon
  // jsPDF lines method is complex for filling, using triangle fan or raw PDF ops is hard.
  // Simplest is to draw lines and try to close path? 
  // Actually jsPDF has 'lines' which accepts an array of coordinates and style.
  // Or simply use triangle strip? No.
  // Let's manually construct the path string 'd' for PDF operators if possible, 
  // or just draw lines for outline.
  // jsPDF advanced API: doc.lines(points, x, y, scale, style, closed)
  
  // Construct relative points for doc.lines
  // But doc.lines takes relative coordinates from the first point. 
  // Easier to just use doc.triangle or just outline.
  // Let's use `doc.saveGraphicsState`, `doc.moveTo`, `doc.lineTo`... if available.
  // Standard jsPDF has triangle, rect, circle.
  // Let's just draw thick lines for the shape outline for now to be safe and robust.
  
  // Actually, let's try to fill it by drawing triangles to the center.
  dataPoints.forEach((p, i) => {
    const nextP = dataPoints[(i + 1) % dataPoints.length];
    doc.triangle(cx, cy, p.x, p.y, nextP.x, nextP.y, 'F');
  });

  // Draw Outline on top
  dataPoints.forEach((p, i) => {
    const nextP = dataPoints[(i + 1) % dataPoints.length];
    doc.line(p.x, p.y, nextP.x, nextP.y);
  });


  yPos += 100; // Move down past the chart

  // 2. DISC Dimensions (Bar Chart)
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('DISC Dimensions', 20, yPos);
  yPos += 10;
  
  const barChartHeight = 60;
  const barChartWidth = 30;
  const barStartX = 40;
  const maxScore = 100;
  
  // D
  doc.setFillColor(239, 68, 68); // Red
  const hD = (data.scores.D / maxScore) * barChartHeight;
  doc.rect(barStartX, yPos + (barChartHeight - hD), barChartWidth, hD, 'F');
  doc.text('D', barStartX + 10, yPos + barChartHeight + 5);
  doc.text(data.scores.D.toString(), barStartX + 8, yPos + (barChartHeight - hD) - 2);

  // I
  doc.setFillColor(234, 179, 8); // Yellow
  const hI = (data.scores.I / maxScore) * barChartHeight;
  doc.rect(barStartX + 40, yPos + (barChartHeight - hI), barChartWidth, hI, 'F');
  doc.text('I', barStartX + 50, yPos + barChartHeight + 5);
  doc.text(data.scores.I.toString(), barStartX + 48, yPos + (barChartHeight - hI) - 2);

  // S
  doc.setFillColor(34, 197, 94); // Green
  const hS = (data.scores.S / maxScore) * barChartHeight;
  doc.rect(barStartX + 80, yPos + (barChartHeight - hS), barChartWidth, hS, 'F');
  doc.text('S', barStartX + 90, yPos + barChartHeight + 5);
  doc.text(data.scores.S.toString(), barStartX + 88, yPos + (barChartHeight - hS) - 2);

  // C
  doc.setFillColor(59, 130, 246); // Blue
  const hC = (data.scores.C / maxScore) * barChartHeight;
  doc.rect(barStartX + 120, yPos + (barChartHeight - hC), barChartWidth, hC, 'F');
  doc.text('C', barStartX + 130, yPos + barChartHeight + 5);
  doc.text(data.scores.C.toString(), barStartX + 128, yPos + (barChartHeight - hC) - 2);

  yPos += barChartHeight + 20;
  
  // Scores Table
  // Check if we have enough space for the table header and at least one row
  if (yPos > pageHeight - 50) {
    doc.addPage();
    addHeader(doc.getNumberOfPages());
    yPos = 70;
  }

  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Assessment Scores', 20, yPos);
  yPos += 10;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Dimension', 'Score', 'Description']],
    body: [
      ['Dominance (D)', data.scores.D.toString(), 'Direct, Firm, Strong-willed'],
      ['Influence (I)', data.scores.I.toString(), 'Outgoing, Enthusiastic, Optimistic'],
      ['Steadiness (S)', data.scores.S.toString(), 'Even-tempered, Accommodating, Patient'],
      ['Conscientiousness (C)', data.scores.C.toString(), 'Analytical, Reserved, Precise'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 20;
  
  // AI Insights
  if (yPos > pageHeight - 40) {
      doc.addPage();
      addHeader(doc.getNumberOfPages());
      yPos = 70;
  }

  doc.setFontSize(16);
  doc.text('Executive AI Summary', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  const splitInsight = doc.splitTextToSize(data.insight, pageWidth - 40);
  doc.text(splitInsight, 20, yPos);
  
  // --- Content Page: Development Plan ---
  doc.addPage();
  addHeader(doc.getNumberOfPages());
  
  yPos = 70;
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Development Plan', 20, yPos);
  yPos += 10;
  
  if (data.developmentPlan && data.developmentPlan.length > 0) {
    const planBody = data.developmentPlan.map(item => [
      item.title,
      item.status,
      item.dueDate || 'N/A',
      item.description
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Goal / Focus Area', 'Status', 'Due Date', 'Details']],
      body: planBody,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42] }, // Slate 900
    });
  } else {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('No development goals recorded yet.', 20, yPos + 10);
  }

  // Add Footers to all pages at the end
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i);
  }

  // Save
  doc.save(`DISC_Report_${data.user.name.replace(/\s+/g, '_')}.pdf`);
};
