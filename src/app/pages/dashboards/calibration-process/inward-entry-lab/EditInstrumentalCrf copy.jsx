import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Page } from "components/shared/Page";
import { Button } from "components/ui";
import { toast } from "sonner";

const EditInstrumentalCrf = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    
    // Get URL parameters
    const searchParams = new URLSearchParams(window.location.search);
    const caliblocation = searchParams.get("caliblocation") || "Lab";
    const calibacc = searchParams.get("calibacc") || "Nabl";

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        rangeToShow: '',
        make: '',
        serialNo: '',
        accuracy: '',
        calibrationValidity: '',
        calibrationStandard: '',
        accessories: '',
        instrumentLocation: '',
        adjustment: '',
        suggestedDueDate: '',
        leastCountToShow: '',
        model: '',
        idNo: '',
        calibrationPerformedAt: '',
        calibrationMethod: '',
        letterRefDate: '',
        conformityStatement: '',
        remark: '',
        adjustmentDetail: ''
    });

    const handleBackToPerformCalibration = () => {
        navigate(`/dashboards/calibration-process/inward-entry-lab/perform-calibration/${id}?caliblocation=${caliblocation}&calibacc=${calibacc}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name.trim()) {
            toast.error("Name is required!");
            return;
        }
        
        if (!formData.instrumentLocation.trim()) {
            toast.error("Instrument Location is required!");
            return;
        }

        // Simulate saving data
        console.log('Saving CRF data:', formData);
        toast.success("CRF updated successfully!");
        
        // Navigate back after a short delay
        setTimeout(() => {
            handleBackToPerformCalibration();
        }, 1500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Page title="Edit Instrumental CRF">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6" style={{margin:"10px 10px 10px 10px"}}>
                {/* Header with Back Button */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <h1 className="text-lg font-semibold text-gray-800">Edit Instrumental CRF</h1>
                    <Button
                        variant="outline"
                        onClick={handleBackToPerformCalibration}
                        className="bg-indigo-500  hover:bg-fuchsia-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                        ← Back to Perform Calibration
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Two Column Layout with Perfect Alignment */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter instrument name"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Range To Show</label>
                                <input
                                    type="text"
                                    name="rangeToShow"
                                    value={formData.rangeToShow}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                                <input
                                    type="text"
                                    name="make"
                                    value={formData.make}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Serial No.</label>
                                <input
                                    type="text"
                                    name="serialNo"
                                    value={formData.serialNo}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Accuracy</label>
                                <input
                                    type="text"
                                    name="accuracy"
                                    value={formData.accuracy}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Calibration Validity</label>
                                <input
                                    type="text"
                                    name="calibrationValidity"
                                    value={formData.calibrationValidity}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Calibration Standard</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="calibrationStandard"
                                        value={formData.calibrationStandard}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                                    />
                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                        ✕
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Accessories</label>
                                <input
                                    type="text"
                                    name="accessories"
                                    value={formData.accessories}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instrument Location</label>
                                <input
                                    type="text"
                                    name="instrumentLocation"
                                    value={formData.instrumentLocation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter location"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment</label>
                                <select
                                    name="adjustment"
                                    value={formData.adjustment}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Due Date</label>
                                <input
                                    type="date"
                                    name="suggestedDueDate"
                                    value={formData.suggestedDueDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4" style={{marginTop:"3px"}}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Calibration Instrument Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Analogue Pressure Gauge">Analogue Pressure Gauge</option>
                                    <option value="Digital Pressure Gauge">Digital Pressure Gauge</option>
                                    <option value="Pressure Transducer">Pressure Transducer</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Least Count To Show</label>
                                <input
                                    type="text"
                                    name="leastCountToShow"
                                    value={formData.leastCountToShow}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID No.</label>
                                <input
                                    type="text"
                                    name="idNo"
                                    value={formData.idNo}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Calibration Performed At</label>
                                <input
                                    type="text"
                                    name="calibrationPerformedAt"
                                    value={formData.calibrationPerformedAt}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Calibration Method</label>
                                <select
                                    name="calibrationMethod"
                                    value={formData.calibrationMethod}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="KTRC-CAL-SOP-025">KTRC-CAL-SOP-025</option>
                                    <option value="KTRC-CAL-SOP-026">KTRC-CAL-SOP-026</option>
                                    <option value="KTRC-CAL-SOP-027">KTRC-CAL-SOP-027</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Letter RefDate</label>
                                <input
                                    type="text"
                                    name="letterRefDate"
                                    value={formData.letterRefDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Conformity Statement</label>
                                <select
                                    name="conformityStatement"
                                    value={formData.conformityStatement}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                                <input
                                    type="text"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Detail (If Any Adjustment Done)</label>
                                <textarea
                                    name="adjustmentDetail"
                                    value={formData.adjustmentDetail}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter adjustment details if any..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
                        <Button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-12 py-3 rounded text-base font-medium transition-colors"
                        >
                            Save CRF
                        </Button>
                    </div>

                    {/* Copyright Footer */}
                    <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
                        Copyright © 2025. All rights reserved.
                    </div>
                </form>
            </div>
        </Page>
    );
};

export default EditInstrumentalCrf;











// this is my view quotation -----------------------






// import React from 'react';

// const QuotationView = () => {
//     const quotationData = {
//         docNo: "KTRC/QF/070101",
//         date: "18.01.2022",
//         refNo: "KTRC/CAL/VIN/0207",
//         customer: {
//             name: "M/s MAHINDRA & MAHINDRA LTD.",
//             address: "Two Wheeler Division, Plot No 2, Industrial Area No 1, Pithampur, Dist. Dhar,454775",
//             mobile: "79677 92155",
//             email: "AKRAMALI.SYED@mahindra.com"
//         },
//         attention: "Mr. Akramali Syed",
//         items: [
//             {
//                 sno: 1,
//                 name: "Universal Testing machine 60 ton FIE/ Make UTE-60/UTE9301 (PANEL)",
//                 description: "Compression Mode Upto 1000kN",
//                 accreditation: "Nabl",
//                 quantity: 1,
//                 rate: 10500,
//                 location: "Site",
//                 amount: 10500
//             },
//             {
//                 sno: 2,
//                 name: "Rockwell/Brinell Hardness Tester",
//                 description: "Rockwell Hardness Tester (HRB,HRC)",
//                 accreditation: "Nabl",
//                 quantity: 1,
//                 rate: 4000,
//                 location: "Site",
//                 amount: 4000
//             },
//             {
//                 sno: 3,
//                 name: "Rockwell/Brinell Hardness Tester Saroj Tool Room",
//                 description: "Rockwell Hardness Tester (HRB,HRC)",
//                 accreditation: "Nabl",
//                 quantity: 1,
//                 rate: 4000,
//                 location: "Site",
//                 amount: 4000
//             },
//             {
//                 sno: 4,
//                 name: "Tensometer Cannan",
//                 description: "Tensometer",
//                 accreditation: "Nabl",
//                 quantity: 1,
//                 rate: 4500,
//                 location: "Site",
//                 amount: 4500
//             },
//             {
//                 sno: 5,
//                 name: "DFT(Dry film thickness tester) Elcometer 456 Coating Thickness Gauge",
//                 description: "Coating Thickness Gauge (Non-NABL)",
//                 accreditation: "Non Nabl",
//                 quantity: 1,
//                 rate: 750,
//                 location: "Lab",
//                 amount: 750
//             },
//             {
//                 sno: 6,
//                 name: "HORN SOUND LEVEL METER (dB meter) RION dB 90~130 Nova-C",
//                 description: "Sound Level Meter",
//                 accreditation: "Non Nabl",
//                 quantity: 1,
//                 rate: 850,
//                 location: "Lab",
//                 amount: 850
//             },
//             {
//                 sno: 7,
//                 name: "DFT(Dry film thickness tester) Fischer dualscope mp60r Models thickness coating gauge",
//                 description: "Coating Thickness Gauge (Non-NABL)",
//                 accreditation: "Non Nabl",
//                 quantity: 1,
//                 rate: 750,
//                 location: "Lab",
//                 amount: 750
//             },
//             {
//                 sno: 8,
//                 name: "Tachometer (Non-Contact Type)",
//                 description: "Tachometer (Non-Contact Type)",
//                 accreditation: "Nabl",
//                 quantity: 1,
//                 rate: 1200,
//                 location: "Lab",
//                 amount: 1200
//             },
//             {
//                 sno: 9,
//                 name: "Shore A Hardness Tester",
//                 description: "Portable Hardness Tester",
//                 accreditation: "Non Nabl",
//                 quantity: 1,
//                 rate: 850,
//                 location: "Site",
//                 amount: 850
//             },
//             {
//                 sno: 10,
//                 name: "Shore D hardness Tester",
//                 description: "Portable Hardness Tester",
//                 accreditation: "Non Nabl",
//                 quantity: 1,
//                 rate: 850,
//                 location: "Site",
//                 amount: 850
//             },
//             {
//                 sno: 11,
//                 name: "Universal Testing machine 20 ton FIE / UTES20HGFL-TS",
//                 description: "Compression Mode Upto 1000kN",
//                 accreditation: "Nabl",
//                 quantity: 1,
//                 rate: 10500,
//                 location: "Site",
//                 amount: 10500
//             },
//             {
//                 sno: 12,
//                 name: "Rockwell/Brinell Hardness Tester FIE / RASNEB-3",
//                 description: "Rockwell Hardness Tester (HRB,HRC)",
//                 accreditation: "Nabl",
//                 quantity: 1,
//                 rate: 5000,
//                 location: "Site",
//                 amount: 5000
//             },
//             {
//                 sno: 13,
//                 name: "Spring Tester (ETCU-100) Cannan",
//                 description: "50 N to 10 kN",
//                 accreditation: "Nabl",
//                 quantity: 1,
//                 rate: 4500,
//                 location: "Site",
//                 amount: 4500
//             }
//         ],
//         subtotal: 48250,
//         discount: 0,
//         mobilizationCharges: 0,
//         freightCharges: 0,
//         subtotal2: 48250,
//         cgst: 4342.50,
//         sgst: 4342.50,
//         total: 56935,
//         terms: [
//             "Equipments which are possible to be calibrated at Site, will be done at site. Rest equipments will be calibrated at our Lab at Indore (M.P.).",
//             "Payment terms: Advance.",
//             "Cross Cheque/DD should be drawn in favor of Kailtech Test & Research Centre Pvt Ltd. Payable at Indore.",
//             "Please attach bill details indicating Invoice No. & TDS deductions if any along with your payment.",
//             "Subject to the exclusive jurisdiction of courts at INDORE only.",
//             "Errors & omissions accepted."
//         ],
//         statutoryDetails: {
//             gstNo: "23AADCK0799A1ZV",
//             serviceCategory: "Scientific and Technical Consultancy",
//             sacCode: "998393",
//             pan: "AADCK0799A",
//             bankAccountNo: "55044016261",
//             bankAccountType: "Overdraft Account",
//             bankName: "Kotak Mahindra Bank Ltd., Indore Branch",
//             ifscCode: "KKBK0005933",
//             micrCode: "452064002",
//             udyamRegistrationNo: "UDYAM-MP-23-0012316",
//             cin: "U73100MP2006PTC019006",
//             typeOfMsme: "Small Scale",
//             beneficiaryName: "Kailtech Test And Research Centre Pvt. Ltd."
//         }
//     };

//     const handlePrint = () => {
//         const printContent = document.getElementById('quotation-print-area');
//         const originalContent = document.body.innerHTML;
        
//         document.body.innerHTML = printContent.innerHTML;
//         window.print();
//         document.body.innerHTML = originalContent;
//         window.location.reload(); // Reload to restore the original page
//     };

//     return (
//         <>
//             <style >{`
//                 @media print {
//                     body * {
//                         visibility: hidden;
//                     }
//                     #quotation-print-area,
//                     #quotation-print-area * {
//                         visibility: visible;
//                     }
//                     #quotation-print-area {
//                         position: absolute;
//                         left: 0;
//                         top: 0;
//                         width: 100%;
//                     }
//                     .no-print {
//                         display: none !important;
//                     }
//                     .print-only {
//                         display: block !important;
//                     }
//                 }
//                 .print-only {
//                     display: none;
//                 }
//             `}</style>
            
//             <div className="min-h-screen bg-gray-50 p-4">
//                 <div className="max-w-7xl mx-auto bg-white shadow-lg">
//                     {/* Header - Hide on print */}
//                     <div className="p-4 border-b bg-gray-50 no-print">
//                         <div className="flex justify-between items-start">
//                             <div className="text-lg font-medium text-gray-700">View Quotation</div>
//                             <button className="bg-cyan-500 text-white px-4 py-2 rounded text-sm hover:bg-cyan-600">
//                                 ← Back to Quotations
//                             </button>
//                         </div>
//                     </div>
                    
//                     {/* Printable Content */}
//                     <div id="quotation-print-area">
//                         <div className="p-6 border-b">
//                             <div className="flex justify-between items-start">
//                                 <div className="flex items-center space-x-4">
//                                     <div className="bg-orange-400 p-3 rounded">
//                                         <div className="text-white font-bold text-lg">ktrc</div>
//                                         <div className="text-xs text-white">Quality Test & Research</div>
//                                     </div>
//                                 </div>
//                                 <div className="text-right text-xs">
//                                     <div className="mb-1">Doc No. {quotationData.docNo}</div>
//                                     <div className="text-blue-600 mb-1">NABL Accredited</div>
//                                     <div className="text-blue-600 mb-1">BIS Recognized</div>
//                                     <div className="text-blue-600">ISO 9001:2015 Certified Lab</div>
//                                 </div>
//                             </div>
                            
//                             {/* Company Info - Centered */}
//                             <div className="text-center mt-6">
//                                 <h1 className="text-xl font-bold text-gray-800">Kailtech Test And Research Centre Pvt. Ltd.</h1>
//                                 <p className="text-xs text-gray-600 mt-1">
//                                     Plot No 14-I-C, Electronic Complex, Industrial Area, Indore-452010 (MADHYA PRADESH) India
//                                 </p>
//                                 <p className="text-xs text-gray-600">
//                                     Ph: 91-731-4787555 (30 lines) Ph: 91-731-4046055, 4046055
//                                 </p>
//                                 <p className="text-xs text-gray-600">
//                                     Email: contact@kailtech.net , Web: http://www.kailtech.net
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Customer Info */}
//                         <div className="p-6 border-b">
//                             {/* Reference Number and Date */}
//                             <div className="text-right text-xs mb-4">
//                                 <div className="mb-1">{quotationData.refNo}</div>
//                                 <div>{quotationData.date}</div>
//                             </div>
                            
//                             <div className="mb-4">
//                                 <div className="font-semibold">{quotationData.customer.name}</div>
//                                 <div className="text-sm text-gray-600">{quotationData.customer.address}</div>
//                                 <div className="text-sm text-gray-600">Mobile: {quotationData.customer.mobile}</div>
//                                 <div className="text-sm text-gray-600">Email: {quotationData.customer.email}</div>
//                             </div>
                            
//                             <div className="text-center font-semibold text-lg mb-4">
//                                 Kind Attn.. {quotationData.attention}
//                             </div>
                            
//                             <div className="text-sm text-gray-700 mb-6">
//                                 <p>Dear Sir,</p>
//                                 <p>This is reference to your Email dated 17/01/2022 and your enquiry regarding your Calibration requirements. We thank you for your enquiry. We are offering you our rates for the product enquire by you as under:</p>
//                             </div>
//                         </div>

//                         {/* Items Table */}
//                         <div className="overflow-x-auto">
//                             <table className="w-full border-collapse border border-gray-300 text-sm">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="border border-gray-300 px-2 py-2 text-left">S.No</th>
//                                         <th className="border border-gray-300 px-2 py-2 text-left">Name</th>
//                                         <th className="border border-gray-300 px-2 py-2 text-left">Description</th>
//                                         <th className="border border-gray-300 px-2 py-2 text-left">Accreditation</th>
//                                         <th className="border border-gray-300 px-2 py-2 text-left">Quantity</th>
//                                         <th className="border border-gray-300 px-2 py-2 text-left">Rate</th>
//                                         <th className="border border-gray-300 px-2 py-2 text-left">Location</th>
//                                         <th className="border border-gray-300 px-2 py-2 text-left">Amount</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {quotationData.items.map((item) => (
//                                         <tr key={item.sno} className="hover:bg-gray-50">
//                                             <td className="border border-gray-300 px-2 py-2">{item.sno}</td>
//                                             <td className="border border-gray-300 px-2 py-2">{item.name}</td>
//                                             <td className="border border-gray-300 px-2 py-2">{item.description}</td>
//                                             <td className="border border-gray-300 px-2 py-2">{item.accreditation}</td>
//                                             <td className="border border-gray-300 px-2 py-2">{item.quantity}</td>
//                                             <td className="border border-gray-300 px-2 py-2">{item.rate}</td>
//                                             <td className="border border-gray-300 px-2 py-2">{item.location}</td>
//                                             <td className="border border-gray-300 px-2 py-2">{item.amount}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Totals Section */}
//                         <div className="p-6">
//                             <div className="flex justify-end">
//                                 <div className="w-96">
//                                     <div className="flex justify-between py-1">
//                                         <span>Subtotal</span>
//                                         <span>{quotationData.subtotal}</span>
//                                     </div>
//                                     <div className="flex justify-between py-1">
//                                         <span>Discount</span>
//                                         <span>{quotationData.discount}</span>
//                                     </div>
//                                     <div className="flex justify-between py-1">
//                                         <span>Mobilization & Demobilization Charges</span>
//                                         <span>{quotationData.mobilizationCharges}</span>
//                                     </div>
//                                     <div className="flex justify-between py-1">
//                                         <span>Freight Charges</span>
//                                         <span>{quotationData.freightCharges}</span>
//                                     </div>
//                                     <div className="flex justify-between py-1 border-t">
//                                         <span>Subtotal 2</span>
//                                         <span>{quotationData.subtotal2}</span>
//                                     </div>
//                                     <div className="flex justify-between py-1">
//                                         <span>CGST 9%</span>
//                                         <span>{quotationData.cgst}</span>
//                                     </div>
//                                     <div className="flex justify-between py-1">
//                                         <span>SGST 9%</span>
//                                         <span>{quotationData.sgst}</span>
//                                     </div>
//                                     <div className="flex justify-between py-2 font-bold text-lg border-t">
//                                         <span>Total</span>
//                                         <span>{quotationData.total}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Terms */}
//                         <div className="p-6 border-t">
//                             <div className="mb-4">
//                                 <h3 className="font-semibold mb-2">Terms:</h3>
//                                 <ol className="text-sm space-y-1">
//                                     {quotationData.terms.map((term, index) => (
//                                         <li key={index}>
//                                             <span className="font-medium">{index + 1}.</span> {term}
//                                         </li>
//                                     ))}
//                                 </ol>
//                             </div>
//                         </div>

//                         {/* Statutory Details */}
//                         <div className="p-6 border-t">
//                             <h3 className="font-semibold mb-4">Statutory Detail</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                                 <div className="space-y-2">
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">GST No.</span>
//                                         <span>{quotationData.statutoryDetails.gstNo}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">Service Category</span>
//                                         <span>{quotationData.statutoryDetails.serviceCategory}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">SAC Code</span>
//                                         <span>{quotationData.statutoryDetails.sacCode}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">PAN</span>
//                                         <span>{quotationData.statutoryDetails.pan}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">Bank Account No.</span>
//                                         <span>{quotationData.statutoryDetails.bankAccountNo}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">Bank Account Type</span>
//                                         <span>{quotationData.statutoryDetails.bankAccountType}</span>
//                                     </div>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">Bank Name</span>
//                                         <span>{quotationData.statutoryDetails.bankName}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">IFSC CODE</span>
//                                         <span>{quotationData.statutoryDetails.ifscCode}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">MICR CODE</span>
//                                         <span>{quotationData.statutoryDetails.micrCode}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">Udyam Registration No.</span>
//                                         <span>{quotationData.statutoryDetails.udyamRegistrationNo}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">CIN</span>
//                                         <span>{quotationData.statutoryDetails.cin}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">Type of MSME</span>
//                                         <span>{quotationData.statutoryDetails.typeOfMsme}</span>
//                                     </div>
//                                     <div className="flex">
//                                         <span className="w-40 font-medium">Beneficiary Name</span>
//                                         <span>{quotationData.statutoryDetails.beneficiaryName}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Signature Section */}
//                         <div className="p-6 border-t">
//                             <div className="text-sm mb-4">
//                                 <p>Looking forward to receiving your valuable samples</p>
//                                 <br />
//                                 <p>Thanks and regards,</p>
//                                 <div className="mt-4 text-xs">
//                                     <p>Electronically Signed by</p>
//                                     <p>Nitin Patidar</p>
//                                     <p>Designation: Executive(Business Development)</p>
//                                     <p>Date:18/01/2022</p>
//                                     <p>07314787555</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Download Button - Hide on print */}
//                     <div className="p-6 border-t bg-gray-50 text-right no-print">
//                         <button 
//                             className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
//                             onClick={handlePrint}
//                         >
//                             Download Quotation
//                         </button>
//                     </div>

//                     {/* Footer - Hide on print */}
//                     <div className="text-center text-xs text-gray-500 py-4 border-t no-print">
//                         Copyright © 2025. All rights reserved.
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default QuotationView;