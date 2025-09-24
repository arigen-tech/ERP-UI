import { useState, useEffect } from "react"

const RelationMaster = () => {
    const [formData, setFormData] = useState({
        relationName: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRelation, setEditingRelation] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [pageInput, setPageInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [relationData, setRelationData] = useState([
        { id: 1, relationName: "Self", status: "y" },
        { id: 2, relationName: "Father", status: "y" },
        { id: 3, relationName: "Mother", status: "y" },
        { id: 4, relationName: "Son", status: "y" },
        { id: 5, relationName: "Daughter", status: "y" },
        { id: 6, relationName: "Husband", status: "y" },
        { id: 7, relationName: "Wife", status: "y" },
        { id: 8, relationName: "Brother", status: "y" },
        { id: 9, relationName: "Sister", status: "y" },
        { id: 10, relationName: "Grandfather", status: "y" },
        { id: 11, relationName: "Grandmother", status: "y" },
        { id: 12, relationName: "Grandson", status: "y" },
        { id: 13, relationName: "Granddaughter", status: "y" },
        { id: 14, relationName: "Uncle", status: "y" },
        { id: 15, relationName: "Aunt", status: "y" },
        { id: 16, relationName: "Nephew", status: "y" },
        { id: 17, relationName: "Niece", status: "y" },
        { id: 18, relationName: "Cousin", status: "y" },
        { id: 19, relationName: "Father-in-law", status: "y" },
        { id: 20, relationName: "Mother-in-law", status: "y" },
        { id: 21, relationName: "Son-in-law", status: "y" },
        { id: 22, relationName: "Daughter-in-law", status: "y" },
        { id: 23, relationName: "Brother-in-law", status: "y" },
        { id: 24, relationName: "Sister-in-law", status: "y" },
        { id: 25, relationName: "Stepfather", status: "y" },
        { id: 26, relationName: "Stepmother", status: "y" },
        { id: 27, relationName: "Stepson", status: "y" },
        { id: 28, relationName: "Stepdaughter", status: "y" },
        { id: 29, relationName: "Friend", status: "y" },
        { id: 30, relationName: "Other", status: "y" },
    ]);

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, relationId: null, newStatus: false });
    const [totalFilteredProducts, setTotalFilteredProducts] = useState(0);

    const filteredRelations = relationData.filter(relation =>
        relation.relationName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const handleEdit = (relation) => {
        setEditingRelation(relation);
        setShowForm(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        // Get form data directly from the form elements
        const formData = e.target.elements;
        const updatedRelationName = formData.relationName.value;

        if (editingRelation) {
            setRelationData(relationData.map(relation =>
                relation.id === editingRelation.id
                    ? { ...relation, relationName: updatedRelationName, }
                    : relation
            ));
        } else {
            const newRelation = {
                id: relationData.length + 1,
                relationName: updatedRelationName,
                status: "y"
            };
            setRelationData([...relationData, newRelation]);
        }

        setEditingRelation(null);
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData((prevData) => ({ ...prevData, [id]: value }))
    }

    const handleCreateFormSubmit = (e) => {
        e.preventDefault()
        if (formData.relationName) {
            setRelationData([...relationData, { ...formData, id: Date.now(), status: "y" }])
            setFormData({ relationName: "" })
            setShowForm(false)
        } else {
            alert("Please fill out all required fields.")
        }
    }

    const handleSwitchChange = (id, newStatus) => {
        setConfirmDialog({ isOpen: true, relationId: id, newStatus });
    };

    const handleConfirm = (confirmed) => {
        if (confirmed && confirmDialog.relationId !== null) {
            setRelationData((prevData) =>
                prevData.map((relation) =>
                    relation.id === confirmDialog.relationId ? { ...relation, status: confirmDialog.newStatus } : relation
                )
            );
        }
        setConfirmDialog({ isOpen: false, relationId: null, newStatus: null });
    };

    const filteredTotalPages = Math.ceil(filteredRelations.length / itemsPerPage);

    const currentItems = filteredRelations.slice(
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
                            <h4 className="card-title">Relation Master</h4>
                            <div className="d-flex justify-content-between align-items-center">

                                {!showForm ? (
                                    <form className="d-inline-block searchform me-4" role="search">
                                        <div className="input-group searchinput">
                                            <input
                                                type="search"
                                                className="form-control"
                                                placeholder="Search Relations"
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
                                            <button type="button" className="btn btn-success me-2" onClick={() => setShowForm(true)}>
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
                                                <th>Relation Name</th>
                                                <th>Status</th>
                                                <th>Edit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((relation) => (
                                                <tr key={relation.id}>
                                                    <td>{relation.relationName}</td>
                                                    <td>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={relation.status === "y"}
                                                                onChange={() => handleSwitchChange(relation.id, relation.status === "y" ? "n" : "y")}
                                                                id={`switch-${relation.id}`}
                                                            />
                                                            <label
                                                                className="form-check-label px-0"
                                                                htmlFor={`switch-${relation.id}`}
                                                            >
                                                                {relation.status === "y" ? 'Active' : 'Deactive'}
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-success me-2"
                                                            onClick={() => handleEdit(relation)}
                                                            disabled={relation.status !== "y"}
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
                                                Page {currentPage} of {filteredTotalPages} | Total Records: {filteredRelations.length}
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
                                        <label>Relation Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="relationName"
                                            placeholder="Enter Relation Name"
                                            defaultValue={editingRelation ? editingRelation.relationName : ""}
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
                                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Relation Reports</h1>
                                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <p>Generate and view relation-related reports here.</p>
                                                <div className="d-flex flex-column">
                                                    <button className="btn btn-outline-primary mb-2">Export All Relations</button>
                                                    <button className="btn btn-outline-success mb-2">Active Relations Report</button>
                                                    <button className="btn btn-outline-warning">Inactive Relations Report</button>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                                <button type="button" className="btn btn-primary">Generate Report</button>
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
                                                    Are you sure you want to {confirmDialog.newStatus === "y" ? 'activate' : 'deactivate'} <strong>{relationData.find(relation => relation.id === confirmDialog.relationId)?.relationName}</strong> relation?
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

export default RelationMaster;