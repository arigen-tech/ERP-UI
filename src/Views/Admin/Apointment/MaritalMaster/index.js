import { useState, useEffect } from "react"

const MaritalMaster = () => {
    const [formData, setFormData] = useState({
        maritalStatusName: "", maritalStatusCode: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingMaritalStatus, setEditingMaritalStatus] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [pageInput, setPageInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [maritalStatusData, setMaritalStatusData] = useState([
        { id: 1, maritalStatusName: "Single", maritalStatusCode: "S", status: "y" },
        { id: 2, maritalStatusName: "Married", maritalStatusCode: "M", status: "y" },
        { id: 3, maritalStatusName: "Divorced", maritalStatusCode: "D", status: "y" },
        { id: 4, maritalStatusName: "Widowed", maritalStatusCode: "W", status: "y" },
        { id: 5, maritalStatusName: "Separated", maritalStatusCode: "SEP", status: "y" },
        { id: 6, maritalStatusName: "Engaged", maritalStatusCode: "E", status: "y" },
        { id: 7, maritalStatusName: "In a Relationship", maritalStatusCode: "RE", status: "y" },
        { id: 8, maritalStatusName: "Domestic Partnership", maritalStatusCode: "DP", status: "y" },
        { id: 9, maritalStatusName: "Civil Union", maritalStatusCode: "s", status: "y" },
        { id: 10, maritalStatusName: "Annulled", maritalStatusCode: "A", status: "y" },
        { id: 11, maritalStatusName: "It's Complicated", maritalStatusCode: "C", status: "y" },
        { id: 12, maritalStatusName: "Prefer not to say", maritalStatusCode: "NS", status: "y" },
    ]);

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, maritalStatusId: null, newStatus: false });
    const [totalFilteredProducts, setTotalFilteredProducts] = useState(0);

    const filteredMaritalStatuses = maritalStatusData.filter(maritalStatus =>
        maritalStatus.maritalStatusName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const handleEdit = (maritalStatus) => {
        setEditingMaritalStatus(maritalStatus);
        setShowForm(true);
    };

    const handleAdd = () => {
        setShowForm(true);
        setEditingMaritalStatus(null);
        setFormData({ maritalStatusName: "", maritalStatusCode: "" });
        setIsFormValid(false);
    }

    const handleSave = (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        // Get form data directly from the form elements
        const formData = e.target.elements;
        const updatedMaritalStatusName = formData.maritalStatusName.value;
        const updatedMaritalStatusCode = formData.maritalStatusCode.value;

        if (editingMaritalStatus) {
            setMaritalStatusData(maritalStatusData.map(maritalStatus =>
                maritalStatus.id === editingMaritalStatus.id
                    ? { ...maritalStatus, maritalStatusName: updatedMaritalStatusName, maritalStatusCode: updatedMaritalStatusCode }
                    : maritalStatus
            ));
        } else {
            const newMaritalStatus = {
                id: maritalStatusData.length + 1,
                maritalStatusName: updatedMaritalStatusName,
                maritalStatusCode: updatedMaritalStatusCode,
                status: "y"
            };
            setMaritalStatusData([...maritalStatusData, newMaritalStatus]);
        }

        setEditingMaritalStatus(null);
        setShowForm(false);
    };



    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData((prevData) => ({ ...prevData, [id]: value }))
    }

    const handleCreateFormSubmit = (e) => {
        e.preventDefault()
        if (formData.maritalStatusName) {
            setMaritalStatusData([...maritalStatusData, { ...formData, id: Date.now(), status: "y" }])
            setFormData({ maritalStatusName: "" })
            setShowForm(false)
        } else {
            alert("Please fill out all required fields.")
        }
    }

    const handleSwitchChange = (id, newStatus) => {
        setConfirmDialog({ isOpen: true, maritalStatusId: id, newStatus });
    };

    const handleConfirm = (confirmed) => {
        if (confirmed && confirmDialog.maritalStatusId !== null) {
            setMaritalStatusData((prevData) =>
                prevData.map((maritalStatus) =>
                    maritalStatus.id === confirmDialog.maritalStatusId ? { ...maritalStatus, status: confirmDialog.newStatus } : maritalStatus
                )
            );
        }
        setConfirmDialog({ isOpen: false, maritalStatusId: null, newStatus: null });
    };

    const filteredTotalPages = Math.ceil(filteredMaritalStatuses.length / itemsPerPage);

    const currentItems = filteredMaritalStatuses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageNavigation = () => {
        const pageNumber = parseInt(pageInput, 10);
        if (pageNumber > 0 && pageNumber <= filteredTotalPages) {
            setCurrentPage(pageNumber);
        } else {
            alert("Please enter a valid page number.");
        }
    };

    const renderPagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(filteredTotalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(1);
            if (startPage > 2) pageNumbers.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < filteredTotalPages) {
            if (endPage < filteredTotalPages - 1) pageNumbers.push("...");
            pageNumbers.push(filteredTotalPages);
        }

        return pageNumbers.map((number, index) => (
            <li key={index} className={`page-item ${number === currentPage ? "active" : ""}`}>
                {typeof number === "number" ? (
                    <button className="page-link" onClick={() => setCurrentPage(number)}>
                        {number}
                    </button>
                ) : (
                    <span className="page-link disabled">{number}</span>
                )}
            </li>
        ));
    };

    return (
        <div className="content-wrapper">
            <div className="row">
                <div className="col-12 grid-margin stretch-card">
                    <div className="card form-card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title">Marital Status Master</h4>
                            <div className="d-flex justify-content-between align-items-center">

                                {!showForm ? (
                                    <form className="d-inline-block searchform me-4" role="search">
                                        <div className="input-group searchinput">
                                            <input
                                                type="search"
                                                className="form-control"
                                                placeholder="Search Marital Status"
                                                aria-label="Search"
                                                value={searchQuery}
                                                onChange={handleSearch}

                                            />
                                            <span className="input-group-text" id="search-icon">
                                                <i className="fa fa-search"></i>
                                            </span>
                                        </div>
                                    </form>
                                ) : (
                                    <></>
                                )}


                                <div className="d-flex align-items-center">
                                    {!showForm ? (
                                        <>
                                            <button type="button" className="btn btn-success me-2" onClick={() => {
                                                setShowForm(true);
                                                handleAdd();
                                            }
                                            }>
                                                <i className="mdi mdi-plus"></i> Add
                                            </button>
                                            <button type="button" className="btn btn-success me-2">
                                                <i className="mdi mdi-plus"></i> Show All
                                            </button>
                                            <button type="button" className="btn btn-success me-2" onClick={() => setShowModal(true)}>
                                                <i className="mdi mdi-plus"></i> Reports
                                            </button>
                                        </>
                                    ) : (
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                                            <i className="mdi mdi-arrow-left"></i> Back
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {!showForm ? (
                                <div className="table-responsive packagelist">
                                    <table className="table table-bordered table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Marital Status Name</th>
                                                <th>Marital Status Code</th>
                                                <th>Status</th>
                                                <th>Edit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((maritalStatus) => (
                                                <tr key={maritalStatus.id}>

                                                    <td>{maritalStatus.maritalStatusName}</td>
                                                    <td>{maritalStatus.maritalStatusCode}</td>
                                                    <td>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={maritalStatus.status === "y"}
                                                                onChange={() => handleSwitchChange(maritalStatus.id, maritalStatus.status === "y" ? "n" : "y")}
                                                                id={`switch-${maritalStatus.id}`}
                                                            />
                                                            <label
                                                                className="form-check-label px-0"
                                                                htmlFor={`switch-${maritalStatus.id}`}
                                                            >
                                                                {maritalStatus.status === "y" ? 'Active' : 'Deactive'}
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-success me-2"
                                                            onClick={() => handleEdit(maritalStatus)}
                                                            disabled={maritalStatus.status !== "y"}
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <nav className="d-flex justify-content-between align-items-center mt-3">
                                        <div>
                                            <span>
                                                Page {currentPage} of {filteredTotalPages} | Total Records: {filteredMaritalStatuses.length}
                                            </span>
                                        </div>
                                        <ul className="pagination mb-0">
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    &laquo; Previous
                                                </button>
                                            </li>
                                            {renderPagination()}
                                            <li className={`page-item ${currentPage === filteredTotalPages ? "disabled" : ""}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    disabled={currentPage === filteredTotalPages}
                                                >
                                                    Next &raquo;
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="number"
                                                min="1"
                                                max={filteredTotalPages}
                                                value={pageInput}
                                                onChange={(e) => setPageInput(e.target.value)}
                                                placeholder="Go to page"
                                                className="form-control me-2"
                                            />
                                            <button
                                                className="btn btn-primary"
                                                onClick={handlePageNavigation}
                                            >
                                                Go
                                            </button>
                                        </div>
                                    </nav>
                                </div>
                            ) : (
                                <form className="forms row" onSubmit={handleSave}>
                                    <div className="form-group col-md-4">
                                        <label>Marital Status Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="maritalStatusName"
                                            placeholder="Marital Status Name"
                                            defaultValue={editingMaritalStatus ? editingMaritalStatus.maritalStatusName : ""}
                                            onChange={() => setIsFormValid(true)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label>Marital Status Code <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="maritalStatusCode"
                                            placeholder="Marital Status Code"
                                            defaultValue={editingMaritalStatus ? editingMaritalStatus.maritalStatusCode : ""}
                                            onChange={() => setIsFormValid(true)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group col-md-12 d-flex justify-content-end mt-2">
                                        <button type="submit" className="btn btn-primary me-2" disabled={!isFormValid}>
                                            Save
                                        </button>
                                        <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                            {showModal && (
                                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                {/* Your modal content goes here */}
                                                ...
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                                <button type="button" className="btn btn-primary">Understood</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {confirmDialog.isOpen && (
                                <div className="modal d-block" tabIndex="-1" role="dialog">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Confirm Status Change</h5>
                                                <button type="button" className="close" onClick={() => handleConfirm(false)}>
                                                    <span>&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <p>
                                                    Are you sure you want to {confirmDialog.newStatus === "y" ? 'activate' : 'deactivate'} <strong>{maritalStatusData.find(maritalStatus => maritalStatus.id === confirmDialog.maritalStatusId)?.maritalStatusName}</strong>?
                                                </p>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => handleConfirm(false)}>No</button>
                                                <button type="button" className="btn btn-primary" onClick={() => handleConfirm(true)}>Yes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaritalMaster;