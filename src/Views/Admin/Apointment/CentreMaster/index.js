import { useState } from "react";

const CentreMaster = () => {
  const [formData, setFormData] = useState({
    centreName: "",
    centreCode: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCentre, setEditingCentre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [centreData, setCentreData] = useState([
    { id: 1, centreName: "Main Centre", centreCode: "MC", status: "y" },
    { id: 2, centreName: "Branch Centre", centreCode: "BC", status: "y" },
    { id: 3, centreName: "Training Centre", centreCode: "TC", status: "y" },
    { id: 4, centreName: "Testing Centre", centreCode: "TST", status: "y" },
    { id: 5, centreName: "Support Centre", centreCode: "SC", status: "y" },
    { id: 6, centreName: "Research Centre", centreCode: "RC", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    centreId: null,
    newStatus: false,
  });

  // 🔍 Search
  const filteredCentres = centreData.filter((centre) =>
    centre.centreName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 📄 Pagination
  const totalPages = Math.ceil(filteredCentres.length / itemsPerPage);
  const currentItems = filteredCentres.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setFormData({ centreName: "", centreCode: "" });
    setEditingCentre(null);
    setShowForm(true);
    setIsFormValid(false);
  };

  const handleEdit = (centre) => {
    setFormData({
      centreName: centre.centreName,
      centreCode: centre.centreCode,
    });
    setEditingCentre(centre);
    setShowForm(true);
    setIsFormValid(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (editingCentre) {
      setCentreData(
        centreData.map((centre) =>
          centre.id === editingCentre.id ? { ...centre, ...formData } : centre
        )
      );
    } else {
      const newCentre = {
        id: Date.now(),
        ...formData,
        status: "y",
      };
      setCentreData([...centreData, newCentre]);
    }
    setShowForm(false);
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, centreId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.centreId !== null) {
      setCentreData((prev) =>
        prev.map((c) =>
          c.id === confirmDialog.centreId ? { ...c, status: confirmDialog.newStatus } : c
        )
      );
    }
    setConfirmDialog({ isOpen: false, centreId: null, newStatus: null });
  };

  const handlePageNavigation = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      alert("Please enter a valid page number.");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card form-card">
            {/* Header */}
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title">Centre Master</h4>
              <div className="d-flex align-items-center">
                {!showForm ? (
                  <>
                    {/* Search Bar */}
                    <form className="d-inline-block searchform me-4">
                      <div className="input-group searchinput">
                        <input
                          type="search"
                          className="form-control"
                          placeholder="Search Centre"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                        <span className="input-group-text">
                          <i className="fa fa-search"></i>
                        </span>
                      </div>
                    </form>
                    <button className="btn btn-success me-2" onClick={handleAdd}>
                      <i className="mdi mdi-plus"></i> Add
                    </button>
                    <button className="btn btn-success me-2" onClick={() => setShowModal(true)}>
                      <i className="mdi mdi-file"></i> Reports
                    </button>
                  </>
                ) : (
                  <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    <i className="mdi mdi-arrow-left"></i> Back
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="card-body">
              {!showForm ? (
                // Table
                <div className="table-responsive packagelist">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Centre Name</th>
                        <th>Centre Code</th>
                        <th>Status</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((centre) => (
                        <tr key={centre.id}>
                          <td>{centre.centreName}</td>
                          <td>{centre.centreCode}</td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={centre.status === "y"}
                                onChange={() =>
                                  handleSwitchChange(centre.id, centre.status === "y" ? "n" : "y")
                                }
                              />
                              <label className="form-check-label">
                                {centre.status === "y" ? "Active" : "Inactive"}
                              </label>
                            </div>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEdit(centre)}
                              disabled={centre.status !== "y"}
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <nav className="d-flex justify-content-between align-items-center mt-3">
                    <span>
                      Page {currentPage} of {totalPages} | Total Records: {filteredCentres.length}
                    </span>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          &laquo; Prev
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next &raquo;
                        </button>
                      </li>
                    </ul>
                    <div className="d-flex align-items-center">
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        placeholder="Go to page"
                        className="form-control me-2"
                      />
                      <button className="btn btn-primary" onClick={handlePageNavigation}>
                        Go
                      </button>
                    </div>
                  </nav>
                </div>
              ) : (
                // Form
                <form className="forms row" onSubmit={handleSave}>
                  <div className="form-group col-md-4">
                    <label>
                      Centre Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Centre Name"
                      value={formData.centreName}
                      onChange={(e) => {
                        setFormData({ ...formData, centreName: e.target.value });
                        setIsFormValid(e.target.value && formData.centreCode);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>
                      Centre Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Centre Code"
                      value={formData.centreCode}
                      onChange={(e) => {
                        setFormData({ ...formData, centreCode: e.target.value });
                        setIsFormValid(formData.centreName && e.target.value);
                      }}
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

              {/* Reports Modal */}
              {showModal && (
                <div className="modal fade show" style={{ display: "block" }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Reports</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                      </div>
                      <div className="modal-body">Report content goes here...</div>
                      <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                          Close
                        </button>
                        <button className="btn btn-primary">Download</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Modal */}
              {confirmDialog.isOpen && (
                <div className="modal d-block">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Confirm Status Change</h5>
                        <button className="btn-close" onClick={() => handleConfirm(false)} />
                      </div>
                      <div className="modal-body">
                        Are you sure you want to{" "}
                        {confirmDialog.newStatus === "y" ? "activate" : "deactivate"}{" "}
                        <strong>
                          {centreData.find((c) => c.id === confirmDialog.centreId)?.centreName}
                        </strong>
                        ?
                      </div>
                      <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => handleConfirm(false)}>
                          No
                        </button>
                        <button className="btn btn-primary" onClick={() => handleConfirm(true)}>
                          Yes
                        </button>
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
  );
};

export default CentreMaster;
