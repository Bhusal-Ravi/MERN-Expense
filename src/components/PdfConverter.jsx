import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toPng } from 'html-to-image';

function PdfConverter({ expense, incomeamount, outgoingamount, netbalance, chartRef }) {
    const exportPDF = async () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Header
        doc.setFont('helvetica', 'normal');
        doc.setDrawColor(44, 62, 80);
        doc.setFillColor(44, 62, 80);
        doc.rect(0, 0, 210, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text("FINANCIAL REPORT", 105, 15, { align: 'center' });

        // Summary section
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 30);

        doc.setDrawColor(189, 195, 199);
        doc.setFillColor(236, 240, 241);
        doc.roundedRect(15, 45, 180, 25, 3, 3, 'FD');

        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
        doc.text("Summary", 22, 48);

        doc.setFontSize(11);
        doc.text(`Total Income: $${incomeamount.toFixed(2)}`, 22, 55);
        doc.text(`Total Expense: $${outgoingamount.toFixed(2)}`, 22, 60);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Net Balance: $${netbalance.toFixed(2)}`, 22, 67);
        doc.setFont('helvetica', 'normal');

        // Chart export
        let chartY = 75;

        try {
            if (!chartRef.current) throw new Error('Chart reference is null');

            const chartElements = chartRef.current.querySelectorAll('.recharts-wrapper');
            if (chartElements.length === 0) throw new Error('No charts found');

            for (let i = 0; i < chartElements.length; i++) {
                const chart = chartElements[i];
                const { width, height } = chart.getBoundingClientRect();
                const aspectRatio = width / height;

                const chartImage = await toPng(chart, {
                    pixelRatio: 3,
                    backgroundColor: '#ffffff'
                });

                const maxWidth = 180;
                const chartHeight = maxWidth / aspectRatio;

                // If chart would overflow the page height, go to next page
                if (chartY + chartHeight > 270) {
                    doc.addPage();
                    chartY = 20;
                }

                doc.addImage(chartImage, "PNG", 15, chartY, maxWidth, chartHeight);
                chartY += chartHeight + 10;
            }
        } catch (error) {
            console.error('Chart export error:', error);
            doc.setFontSize(12);
            doc.setTextColor(150, 150, 150);
            doc.text("Charts could not be exported", 105, chartY, { align: 'center' });
            chartY += 20;
        }

        // Table data
        const tableData = expense.map((e) => [
            new Date(e.date).toLocaleDateString(),
            e.type,
            { content: `$${parseFloat(e.amount).toFixed(2)}`, styles: { halign: 'right' } },
            e.note || "-"
        ]);

        autoTable(doc, {
            startY: chartY + 10,
            head: [
                [
                    { content: 'Date', styles: { fillColor: [44, 62, 80], textColor: [255, 255, 255], fontStyle: 'bold' } },
                    { content: 'Type', styles: { fillColor: [44, 62, 80], textColor: [255, 255, 255], fontStyle: 'bold' } },
                    { content: 'Amount', styles: { fillColor: [44, 62, 80], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'right' } },
                    { content: 'Note', styles: { fillColor: [44, 62, 80], textColor: [255, 255, 255], fontStyle: 'bold' } }
                ]
            ],
            body: tableData,
            theme: 'grid',
            alternateRowStyles: {
                fillColor: [236, 240, 241]
            },
            styles: {
                cellPadding: 3,
                fontSize: 10,
                valign: 'middle'
            },
            columnStyles: {
                2: { cellWidth: 'auto', halign: 'right' }
            },
            margin: { left: 15 }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
            doc.text("© Expense Manager", 195, 287, { align: 'right' });
        }

        doc.save(`Financial-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return (
        <button
            onClick={exportPDF}
            className="pdf-button hidden"
        />
    );
}

export default PdfConverter;
