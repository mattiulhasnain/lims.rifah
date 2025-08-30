import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';

export interface PDFOptions {
  title: string;
  filename: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
}

export const generatePDF = async (elementId: string, options: PDFOptions) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  // Set fixed A4 size
  element.style.width = '210mm';
  element.style.height = '297mm';
  element.style.overflow = '';

  // Shrink-to-fit logic
  const pxPerMm = 96 / 25.4; // 1mm = 96/25.4 px
  const maxHeightPx = 297 * pxPerMm;
  const contentHeight = element.scrollHeight;
  let scale = 1;
  if (contentHeight > maxHeightPx) {
    scale = maxHeightPx / contentHeight;
    element.style.transformOrigin = 'top left';
    element.style.transform = `scale(${scale})`;
  } else {
    element.style.transform = '';
  }

  // Create canvas from HTML element
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });

  // Reset transform after rendering
  element.style.transform = '';

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'mm',
    format: options.format || 'a4'
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm

  // Always fit content to one page
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, pageHeight);

  // Save the PDF
  pdf.save(options.filename);
};

export const createReportPDF = async (reportData: any) => {
  // Create a temporary div for PDF generation
  const tempDiv = document.createElement('div');
  tempDiv.id = 'pdf-report-temp';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '0';
  tempDiv.style.fontFamily = 'Arial, sans-serif';

  tempDiv.innerHTML = `
    <div style="width: 100%; margin: 0; padding: 0;">
      <img src="/image.png" alt="Rifah Laboratories Header" style="width: 100%; height: auto; display: block; margin: 0; padding: 0;" />
    </div>
    
    <div style="padding: 20mm; padding-top: 10mm;">
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin-bottom: 15px; text-align: center; font-size: 24px;">LABORATORY REPORT</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border: 1px solid #d1d5db; padding: 15px; background-color: #f9fafb;">
          <div style="flex: 1;">
            <p style="margin: 5px 0;"><strong>Patient Name:</strong> ${reportData.patientName}</p>
            <p style="margin: 5px 0;"><strong>Age/Gender:</strong> ${reportData.patientAge} Years / ${reportData.patientGender}</p>
            <p style="margin: 5px 0;"><strong>Contact:</strong> ${reportData.patientContact}</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <p style="margin: 5px 0;"><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Report ID:</strong> ${reportData.reportId}</p>
            <p style="margin: 5px 0;"><strong>Referred By:</strong> ${reportData.doctorName}</p>
          </div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <thead>
          <tr style="background-color: #1e40af; color: white;">
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: left; font-weight: bold;">Test Name</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: center; font-weight: bold;">Result</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: center; font-weight: bold;">Normal Range</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: center; font-weight: bold;">Unit</th>
            <th style="border: 1px solid #1e40af; padding: 12px; text-align: center; font-weight: bold;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.tests.map((test: any, index: number) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : 'white'};">
              <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: 500;">${test.testName}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center; ${test.isAbnormal ? 'color: #dc2626; font-weight: bold;' : 'font-weight: 500;'}">${test.result}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">${test.normalRange}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">${test.unit || '-'}</td>
              <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">
                <span style="color: ${test.isAbnormal ? '#dc2626' : '#16a34a'}; font-weight: bold;">
                  ${test.isAbnormal ? 'ABNORMAL' : 'NORMAL'}
                </span>
              </td>
            </tr>
            ${Array.isArray(test.parameters) && test.parameters.length > 0 ? `
              <tr>
                <td colspan="5" style="padding: 0;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                      <tr style="background-color: #e5e7eb;">
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Parameter</th>
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Result</th>
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Normal Range</th>
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Unit</th>
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${test.parameters.map((p: any, i: number) => `
                        <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                          <td style="border: 1px solid #d1d5db; padding: 8px;">${p.name}</td>
                          <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center; ${p.isAbnormal ? 'color: #dc2626; font-weight: bold;' : ''}">${p.result}</td>
                          <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${p.normalRange}</td>
                          <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${p.unit || '-'}</td>
                          <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">
                            <span style="color: ${p.isAbnormal ? '#dc2626' : '#16a34a'}; font-weight: bold;">${p.isAbnormal ? 'ABNORMAL' : 'NORMAL'}</span>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </td>
              </tr>
            ` : ''}
          `).join('')}
        </tbody>
      </table>

      ${reportData.interpretation ? `
        <div style="margin-bottom: 20px; border: 1px solid #d1d5db; padding: 15px; background-color: #f9fafb;">
          <h3 style="color: #1e40af; margin-bottom: 10px; font-size: 18px;">Clinical Interpretation & Recommendations</h3>
          <p style="line-height: 1.6; margin: 0;">${reportData.interpretation}</p>
        </div>
      ` : ''}

      ${reportData.criticalValues ? `
        <div style="background-color: #fef2f2; border: 2px solid #dc2626; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="color: #dc2626; font-size: 20px; margin-right: 10px;">⚠️</span>
            <strong style="color: #dc2626; font-size: 16px;">CRITICAL VALUES DETECTED</strong>
          </div>
          <p style="margin: 0; color: #dc2626; font-weight: 500;">This report contains critical values that require immediate medical attention. Please consult your physician immediately.</p>
        </div>
      ` : ''}

      <div style="margin-top: 30px; border-top: 2px solid #1e40af; padding-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: end;">
          <div style="flex: 1;">
            <p style="margin: 5px 0;"><strong>Verified By:</strong> ${reportData.verifiedBy || 'Authorized Pathologist'}</p>
            <p style="margin: 5px 0;"><strong>Verification Date:</strong> ${reportData.verifiedAt ? new Date(reportData.verifiedAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
          </div>
          <div style="text-align: center; flex: 1;">
            <div style="border-top: 1px solid #000; width: 200px; margin: 0 auto 5px auto;"></div>
            <p style="margin: 0; font-weight: bold;">Authorized Verification</p>
          </div>
        </div>
      </div>
    </div>

    <div style="width: 100%; margin-top: 20mm;">
      <img src="/image copy.png" alt="Rifah Laboratories Footer" style="width: 100%; height: auto; display: block;" />
    </div>

    <div style="text-align: center; margin-top: 10px; padding: 0 20mm; font-size: 12px; color: #6b7280;">
      <p style="margin: 5px 0;">Electronically verified report. No signatures required.</p>
      <p style="margin: 5px 0;">Generated on: ${new Date().toLocaleString()}</p>
    </div>
  `;

  document.body.appendChild(tempDiv);
  await generatePDF('pdf-report-temp', { title: 'Report', filename: `Report_${new Date().toISOString().split('T')[0]}.pdf` });
  document.body.removeChild(tempDiv);
};

export const createInvoicePDF = async (invoiceData: any, qrCodeDataUrl: string) => {
  // Create a temporary div for PDF generation
  const tempDiv = document.createElement('div');
  tempDiv.id = 'pdf-invoice-temp';
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm';
  tempDiv.style.height = '297mm';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '0';
  tempDiv.style.fontFamily = 'Poppins, Inter, Arial, sans-serif';
  tempDiv.style.overflow = 'hidden';

  // Beautiful modern invoice design
  const invoiceHtml = `
    <div style="width: 210mm; height: 297mm; box-sizing: border-box; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); position: relative; overflow: hidden;">
      
      <!-- Header Section with Logo Image Only -->
      <div style="width: 100%; margin: 0; padding: 0;">
        <img src="/image.png" alt="Rifah Laboratories Header" style="width: 100%; height: auto; display: block; margin: 0; padding: 0;" />
      </div>

      <!-- Main Content Area -->
      <div style="padding: 18px 18px 0 18px; max-height: 247mm; overflow: auto; box-sizing: border-box;">
        <!-- Invoice Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 12px;">
          <div style="flex: 1; min-width: 0;">
            <div style="background: white; padding: 14px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-left: 4px solid #1e40af;">
              <h2 style="margin: 0 0 10px 0; color: #1e40af; font-size: 18px; font-weight: 600;">INVOICE</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
                <div>
                  <span style="color: #64748b; font-weight: 500;">Invoice #:</span>
                  <span style="color: #1e293b; font-weight: 600; margin-left: 6px;">${invoiceData.invoiceNumber || '--'}</span>
                </div>
                <div>
                  <span style="color: #64748b; font-weight: 500;">Date:</span>
                  <span style="color: #1e293b; font-weight: 600; margin-left: 6px;">${invoiceData.createdAt ? new Date(invoiceData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '--'}</span>
                </div>
                <div>
                  <span style="color: #64748b; font-weight: 500;">Due Date:</span>
                  <span style="color: #1e293b; font-weight: 600; margin-left: 6px;">${invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '--'}</span>
                </div>
                <div>
                  <span style="color: #64748b; font-weight: 500;">Status:</span>
                  <span style="background: ${invoiceData.status === 'paid' ? '#dcfce7' : invoiceData.status === 'partial' ? '#fef3c7' : '#fee2e2'}; color: ${invoiceData.status === 'paid' ? '#166534' : invoiceData.status === 'partial' ? '#92400e' : '#dc2626'}; padding: 3px 7px; border-radius: 6px; font-size: 10px; font-weight: 600; margin-left: 6px; text-transform: uppercase;">${invoiceData.status || 'pending'}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- QR Code Section -->
          <div style="background: white; padding: 14px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); text-align: center; min-width: 100px;">
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px; font-weight: 500;">SCAN FOR VERIFICATION</div>
            <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 70px; height: 70px; border: 2px solid #e2e8f0; border-radius: 8px; margin-bottom: 6px;" />
            <div style="font-size: 9px; color: #94a3b8;">Digital Receipt</div>
          </div>
        </div>

        <!-- Patient & Doctor Information -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
          <!-- Patient Information -->
          <div style="background: white; padding: 14px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 10px 0; color: #10b981; font-size: 14px; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 6px;">👤</span>PATIENT INFORMATION
            </h3>
            <div style="font-size: 12px;">
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">Name:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.patientName || '--'}</span></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">Age/Gender:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.patientAge ? invoiceData.patientAge + ' years' : '--'} / ${invoiceData.patientGender || '--'}</span></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">Contact:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.patientContact || '--'}</span></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">CNIC:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.patientCnic || invoiceData.cnic || '--'}</span></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">Lab #:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.patientId || invoiceData.labNumber || '--'}</span></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">PHCR #:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.phcrNumber || '--'}</span></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">MR #:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.mrNumber || '--'}</span></div>
            </div>
          </div>
          <!-- Doctor Information -->
          <div style="background: white; padding: 14px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-left: 4px solid #f59e0b;">
            <h3 style="margin: 0 0 10px 0; color: #f59e0b; font-size: 14px; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 6px;">👨‍⚕️</span>REFERRING DOCTOR
            </h3>
            <div style="font-size: 12px;">
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">Name:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.doctorName || '--'}</span></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">Sample Type:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.sampleType || 'Collected in Lab'}</span></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">Report Time:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.createdAt ? new Date(invoiceData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</span></div>
              <div style="display: flex; justify-content: space-between;"><span style="color: #64748b;">Created By:</span><span style="color: #1e293b; font-weight: 600;">${invoiceData.createdBy || 'Staff'}</span></div>
            </div>
          </div>
        </div>

        <!-- Tests Table -->
        <div style="background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); overflow: hidden; margin-bottom: 12px;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 10px 14px;">
            <h3 style="margin: 0; color: white; font-size: 14px; font-weight: 600; display: flex; align-items: center;"><span style="margin-right: 6px;">🔬</span>DIAGNOSTIC TESTS</h3>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 10px 14px; text-align: left; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Test Description</th>
                <th style="padding: 10px 14px; text-align: center; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Quantity</th>
                <th style="padding: 10px 14px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Unit Price</th>
                <th style="padding: 10px 14px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${Array.isArray(invoiceData.tests) && invoiceData.tests.length > 0 ? invoiceData.tests.map((test: any, idx: number) => `
                <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                  <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6; color: #1e293b; font-weight: 500;">${test.testName || test.name || '-'}</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6; text-align: center; color: #6b7280;">${test.quantity || 1}</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #6b7280;">Rs. ${(test.price || 0).toLocaleString()}</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #1e293b; font-weight: 600;">Rs. ${((test.price || 0) * (test.quantity || 1)).toLocaleString()}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="4" style="padding: 20px 14px; text-align: center; color: #9ca3af; font-style: italic;">No tests selected</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>

        <!-- Payment Summary -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 12px;">
          <!-- Payment History -->
          <div style="background: white; padding: 14px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-left: 4px solid #8b5cf6;">
            <h3 style="margin: 0 0 10px 0; color: #8b5cf6; font-size: 14px; font-weight: 600; display: flex; align-items: center;"><span style="margin-right: 6px;">💰</span>PAYMENT HISTORY</h3>
            ${invoiceData.paymentHistory && invoiceData.paymentHistory.length > 0 ? `
              <div>
                ${invoiceData.paymentHistory.map((payment: any, idx: number) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'}; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 4px;">
                    <div style="display: flex; flex-direction: column;"><span style="font-size: 11px; color: #64748b;">${new Date(payment.date).toLocaleDateString()}</span><span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">${payment.method}</span></div>
                    <div style="text-align: right;"><span style="font-size: 12px; font-weight: 600; color: #10b981;">Rs. ${payment.amount.toLocaleString()}</span><div style="font-size: 9px; color: #94a3b8;">${payment.receivedBy}</div></div>
                  </div>
                `).join('')}
              </div>
            ` : `<div style="text-align: center; padding: 10px; color: #9ca3af; font-style: italic;">No payments recorded yet</div>`}
          </div>
          <!-- Amount Summary -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 14px; border-radius: 12px; box-shadow: 0 4px 12px rgba(30, 64, 175, 0.13); color: white;">
            <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; text-align: center;">AMOUNT SUMMARY</h3>
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 12px; opacity: 0.9;">Subtotal:</span><span style="font-size: 12px; font-weight: 600;">Rs. ${(invoiceData.totalAmount || 0).toLocaleString()}</span></div>
              <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 12px; opacity: 0.9;">Discount:</span><span style="font-size: 12px; font-weight: 600; color: #fbbf24;">- Rs. ${(invoiceData.discount || 0).toLocaleString()}</span></div>
              <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;"><span style="font-size: 13px; font-weight: 600;">Net Amount:</span><span style="font-size: 14px; font-weight: 700;">Rs. ${(invoiceData.finalAmount || 0).toLocaleString()}</span></div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;"><span style="font-size: 12px; opacity: 0.9;">Paid Amount:</span><span style="font-size: 12px; font-weight: 600; color: #10b981;">Rs. ${(invoiceData.amountPaid || 0).toLocaleString()}</span></div>
                <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 12px; opacity: 0.9;">Balance Due:</span><span style="font-size: 13px; font-weight: 700; color: ${(invoiceData.finalAmount - (invoiceData.amountPaid || 0)) > 0 ? '#fbbf24' : '#10b981'};">Rs. ${(invoiceData.finalAmount - (invoiceData.amountPaid || 0)).toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: white; padding: 12px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); text-align: center; border-top: 2px solid #1e40af;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
            <div>
              <h4 style="margin: 0 0 5px 0; color: #1e40af; font-size: 12px; font-weight: 600;">TERMS & CONDITIONS</h4>
              <p style="margin: 0; font-size: 10px; color: #64748b; line-height: 1.4;">• Payment is due within 7 days<br/>• Late payments may incur charges<br/>• Reports available after payment</p>
            </div>
            <div>
              <h4 style="margin: 0 0 5px 0; color: #1e40af; font-size: 12px; font-weight: 600;">CONTACT INFORMATION</h4>
              <p style="margin: 0; font-size: 10px; color: #64748b; line-height: 1.4;">📞 +92-XXX-XXXXXXX<br/>📧 info@rifah-lab.com<br/>🌐 www.rifah-lab.com</p>
            </div>
            <div>
              <h4 style="margin: 0 0 5px 0; color: #1e40af; font-size: 12px; font-weight: 600;">AUTHORIZED SIGNATURE</h4>
              <div style="border-top: 1px solid #e2e8f0; width: 60px; margin: 6px auto; padding-top: 6px;"><span style="font-size: 10px; color: #64748b;">Authorized Personnel</span></div>
            </div>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 8px;"><p style="margin: 0; font-size: 9px; color: #94a3b8; font-style: italic;">This is a computer-generated invoice. No physical signature required. Generated on ${new Date().toLocaleString()}</p></div>
        </div>
      </div>
    </div>
  `;

  tempDiv.innerHTML = invoiceHtml;

  document.body.appendChild(tempDiv);

  try {
    await generatePDF('pdf-invoice-temp', {
      title: 'Invoice',
      filename: `Invoice_${invoiceData.invoiceNumber || ''}_${new Date().toISOString().split('T')[0]}.pdf`
    });
  } finally {
    document.body.removeChild(tempDiv);
  }
};

export const createRateListPDF = async (rateList: any) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Add image.png as header on the first page
  const img = new Image();
  img.src = '/image.png';
  await new Promise(resolve => { img.onload = resolve; });
  pdf.addImage(img, 'PNG', 0, 0, 210, 30); // 210mm width, 30mm height

  pdf.setFontSize(18);
  pdf.text('Rate List', 105, 42, { align: 'center' });

  // Prepare table data
  const tableColumn = ['Test Name', 'Category', 'Sample Type', 'Price'];
  const tableRows = rateList.rates.map((rate: any) => [
    rate.testName,
    rate.category,
    rate.sampleType,
    rate.price
  ]);

  // Add table below header (startY: 50mm)
  autoTable(pdf, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    margin: { left: 10, right: 10 },
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    didDrawPage: (data) => {
        if (data.pageNumber > 1) {
        pdf.setFontSize(14);
        pdf.text('Rate List (continued)', 105, 15, { align: 'center' });
      }
    }
  });

  pdf.save('RateList.pdf');
};

export const exportReportsToExcel = (reports: any[], patients: any[], doctors: any[]) => {
  const data = reports.map(report => {
    const patient = patients.find(p => p.id === report.patientId);
    const doctor = doctors.find(d => d.id === report.doctorId);
    return {
      'Report ID': report.id,
      'Patient Name': patient ? patient.name : '',
      'Doctor Name': doctor ? doctor.name : '',
      'Status': report.status,
      'Created At': new Date(report.createdAt).toLocaleString(),
      'Verified By': report.verifiedBy || '',
      'Verified At': report.verifiedAt ? new Date(report.verifiedAt).toLocaleString() : '',
      'Interpretation': report.interpretation || '',
      'Critical Values': report.criticalValues ? 'Yes' : 'No',
      'Tests': report.tests.map((t: any) => {
        const main = `${t.testName}: ${t.result} (${t.normalRange})`;
        const params = Array.isArray(t.parameters) && t.parameters.length > 0
          ? ' | ' + t.parameters.map((p: any) => `${p.name}: ${p.result} (${p.normalRange})`).join('; ')
          : '';
        return main + params;
      }).join('; ')
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `Reports_${new Date().toISOString().split('T')[0]}.xlsx`);
};