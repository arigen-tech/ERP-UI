import { useState } from "react";

const VillageMaster = () => {
  const [formData, setFormData] = useState({ villageName: "", villageCode: "" });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const [villageData, setVillageData] = useState([
    { id: 1, villageName: "Rampur", villageCode: "V001", status: "y" },
    { id: 2, villageName: "Sundarpur", villageCode: "V002", status: "y" },
    { id: 3, villageName: "Basantpur", villageCode: "V003", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    villageId: null,
    newStatus: null,
  });

  const filteredVillages = villageData.filter((village) =>
    village.villageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVillages.length / itemsPerPage);

  const currentItems = filteredVillages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, villageId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.villageId !== null) {
      setVillageData((prev) =>
        prev.map((village) =>
          village.id === confirmDialog.villageId
            ? { ...village, status: confirmDialog.newStatus }
            : village
        )
      );
    }
    setConfirmDialog({ isOpen: false, villageId: null, newStatus: null });
  };

  const handleEdit = (village) => {
    setEditingVillage(village);
    setFormData({
      villageName: village.villageName,
      villageCode: village.villageCode,
    });
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const { villageName, villageCode } = formData;
    if (!villageName || !villageCode) return;

    if (editingVillage) {
      setVillageData((prev) =>
        prev.map((village) =>
          village.id === editingVillage.id
            ? { ...village, villageName, villageCode }
            : village
        )
      );
    } else {
      setVillageData([
        ...villageData,
        { id: Date.now(), villageName, villageCode, status: "y" },
      ]);
    }

    setEditingVillage(null);
    setShowForm(false);
    setFormData({ villageName: "", villageCode: "" });
    setIsFormValid(false);
  };

  const renderPagination = () => {
    return Array.from({ length: totalPages }, (_, i) => (
      <li
        key={i + 1}
        className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
      >
        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
          {i + 1}
        </button>
      </li>
    ));
  };

  const handlePageNavigation = () => {
    const page = parseInt(pageInput);
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      alert("Invalid page number");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Village Master</h4>
          {!showForm ? (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search Village"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  setFormData({ villageName: "", villageCode: "" });
                  setShowForm(true);
                }}
              >
                <i className="mdi mdi-plus"></i> Add
              </button>
              <button
                className="btn btn-success"
                onClick={() => setShowModal(true)}
              >
                <i className="mdi mdi-file-document"></i> Reports
              </button>
            </div>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              <i className="mdi mdi-arrow-left"></i> Back
            </button>
          )}
        </div>
        <div className="card-body">
          {!showForm ? (
            <>
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Village Name</th>
                    <th>Village Code</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((village) => (
                    <tr key={village.id}>
                      <td>{village.villageName}</td>
                      <td>{village.villageCode}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={village.status === "y"}
                            onChange={() =>
                              handleSwitchChange(
                                village.id,
                                village.status === "y" ? "n" : "y"
                              )
                            }
                          />
                          <label className="form-check-label">
                            {village.status === "y" ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(village)}
                          disabled={village.status !== "y"}
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <nav className="d-flex justify-content-between align-items-center mt-3">
                <span>
                  Page {currentPage} of {totalPages} | Total Records:{" "}
                  {filteredVillages.length}
                </span>
                <ul className="pagination mb-0">{renderPagination()}</ul>
                <div className="d-flex">
                  <input
                    type="number"
                    className="form-control me-2"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    placeholder="Go to page"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handlePageNavigation}
                  >
                    Go
                  </button>
                </div>
              </nav>
            </>
          ) : (
            <form onSubmit={handleSave} className="row">
              <div className="form-group col-md-4">
                <label>
                  Village Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.villageName}
                  onChange={(e) =>
                    setFormData({ ...formData, villageName: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-4">
                <label>
                  Village Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.villageCode}
                  onChange={(e) =>
                    setFormData({ ...formData, villageCode: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-12 mt-2 d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={!isFormValid}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Reports Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Village Reports</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Report feature will be implemented...</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmDialog.isOpen && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Change</h5>
                <button
                  className="btn-close"
                  onClick={() => handleConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to{" "}
                  {confirmDialog.newStatus === "y" ? "activate" : "deactivate"}{" "}
                  <strong>
                    {
                      villageData.find((v) => v.id === confirmDialog.villageId)
                        ?.villageName
                    }
                  </strong>
                  ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirm(false)}
                >
                  No
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfirm(true)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VillageMaster;
