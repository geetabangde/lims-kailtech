import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from "components/shared/Page";
import { Button } from "components/ui";
import { toast } from "sonner";
import { Dialog } from '@headlessui/react';

const CancelCrf = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Removed unused itemId
    
    // Get URL parameters
    const searchParams = new URLSearchParams(window.location.search);
    const caliblocation = searchParams.get("caliblocation") || "Lab";
    const calibacc = searchParams.get("calibacc") || "Nabl";

    const [isOpen, setIsOpen] = useState(true);

    const handleBackToPerformCalibration = () => {
        navigate(`/dashboards/calibration-process/inward-entry-lab/perform-calibration/${id}?caliblocation=${caliblocation}&calibacc=${calibacc}`);
    };

    const handleCancelCrf = () => {
        // API call to cancel/delete the CRF would go here
        toast.success("CRF has been cancelled successfully!");
        handleBackToPerformCalibration();
    };

    return (
        <Page title="Cancel CRF">
            {/* Confirmation Modal */}
            <Dialog
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    handleBackToPerformCalibration();
                }}
                className="relative z-50"
            >
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                {/* Modal container */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                        <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                            Confirm CRF Cancellation
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-600 mb-6">
                            Are you sure you want to cancel this CRF? This action cannot be undone.
                        </Dialog.Description>

                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={() => {
                                    setIsOpen(false);
                                    handleBackToPerformCalibration();
                                }}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsOpen(false);
                                    handleCancelCrf();
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Confirm
                            </Button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Empty container - modal will overlay this */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
                {/* Content removed - only modal will be visible */}
            </div>
        </Page>
    );
};

export default CancelCrf;