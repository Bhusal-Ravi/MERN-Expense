import React, { forwardRef, useImperativeHandle } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toPng } from 'html-to-image';
import { FileText } from 'lucide-react';

const PdfConverter = forwardRef(({ expense, incomeamount, outgoingamount, netbalance, chartRef }, ref) => {
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

            // Get all recharts-wrapper elements
            const chartContainers = chartRef.current.querySelectorAll('.recharts-wrapper');
            
            if (chartContainers.length >= 2) {
                // First chart (Bar chart)
                const barChartContainer = chartContainers[0];
                const barChartImage = await toPng(barChartContainer, {
                    quality: 1.0,
                    pixelRatio: 3,
                    backgroundColor: '#ffffff'
                });
                
                // Calculate dimensions to maintain aspect ratio
                const { width: barWidth, height: barHeight } = barChartContainer.getBoundingClientRect();
                const barAspectRatio = barWidth / barHeight;
                const maxWidth = 180;
                const barChartHeight = maxWidth / barAspectRatio;

                doc.addImage(barChartImage, 'PNG', 15, chartY, maxWidth, barChartHeight);
                chartY += barChartHeight + 20;

                // Second chart (Pie chart)
                const pieChartContainer = chartContainers[1];
                const pieChartImage = await toPng(pieChartContainer, {
                    quality: 1.0,
                    pixelRatio: 3,
                    backgroundColor: '#ffffff'
                });

                // Calculate dimensions to maintain aspect ratio
                const { width: pieWidth, height: pieHeight } = pieChartContainer.getBoundingClientRect();
                const pieAspectRatio = pieWidth / pieHeight;
                const pieChartHeight = maxWidth / pieAspectRatio;

                // If chart would overflow the page, add a new page
                if (chartY + pieChartHeight > 270) {
                    doc.addPage();
                    chartY = 20;
                }

                doc.addImage(pieChartImage, 'PNG', 15, chartY, maxWidth, pieChartHeight);
                chartY += pieChartHeight + 20;
                
            } else if (chartContainers.length === 1) {
                // Only one chart available
                const chartContainer = chartContainers[0];
                const chartImage = await toPng(chartContainer, {
                    quality: 1.0,
                    pixelRatio: 3,
                    backgroundColor: '#ffffff'
                });
                
                const { width, height } = chartContainer.getBoundingClientRect();
                const aspectRatio = width / height;
                const maxWidth = 180;
                const chartHeight = maxWidth / aspectRatio;

                doc.addImage(chartImage, 'PNG', 15, chartY, maxWidth, chartHeight);
                chartY += chartHeight + 20;
            } else {
                throw new Error('No chart containers found');
            }
            
        } catch (error) {
            console.error('Error exporting chart:', error);
            doc.setFontSize(12);
            doc.setTextColor(150, 150, 150);
            doc.text("Charts could not be exported", 105, chartY, { align: 'center' });
            chartY += 20;
        }

        // Expense table
        const tableData = expense.map(item => [
            item.type,
            `$${item.amount}`,
            new Date(item.date).toLocaleDateString(),
            item.note
        ]);

        autoTable(doc, {
            startY: chartY,
            head: [['Type', 'Amount', 'Date', 'Note']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80] },
            styles: { fontSize: 10, cellPadding: 5 },
            margin: { top: 10 }
        });

        doc.save('financial-report.pdf');
    };

    useImperativeHandle(ref, () => ({
        exportPDF
    }));

    return (
        <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200"
        >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
        </button>
    );
});

export default PdfConverter;
