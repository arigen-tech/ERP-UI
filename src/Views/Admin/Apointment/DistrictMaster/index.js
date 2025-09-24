import { useState } from "react";

const DistrictMaster = () => {
  const [formData, setFormData] = useState({ districtName: "", districtCode: "" });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const [districtData, setDistrictData] = useState([
    { id: 1, districtName: "Bhubaneswar", districtCode: "BBSR", status: "y" },
    { id: 2, districtName: "Cuttack", districtCode: "CTC", status: "y" },
    { id: 3, districtName: "Puri", districtCode: "PURI", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    districtId: null,
    newStatus: null,
  });

  const filteredDistricts = districtData.filter((d) =>
    d.districtName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDistricts.length / itemsPerPage);

  const currentItems = filteredDistricts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, districtId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.districtId !== null) {
      setDistrictData((prev) =>
        prev.map((d) =>
          d.id === confirmDialog.districtId
            ? { ...d, status: confirmDialog.newStatus }
            : d
        )
      );
    }
    setConfirmDialog({ isOpen: false, districtId: null, newStatus: null });
  };

  const handleEdit = (district) => {
    setEditingDistrict(district);
    setFormData({
      districtName: district.districtName,
      districtCode: district.districtCode,
    });
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const { districtName, districtCode } = formData;
    if (!districtName || !districtCode) return;

    if (editingDistrict) {
      setDistrictData((prev) =>
        prev.map((d) =>
          d.id === editingDistrict.id
            ? { ...d, districtName, districtCode }
            : d
        )
      );
    } else {
      setDistrictData([
        ...districtData,
        { id: Date.now(), districtName, districtCode, status: "y" },
      ]);
    }

    setEditingDistrict(null);
    setShowForm(false);
    setFormData({ districtName: "", districtCode: "" });
    setIsFormValid(false);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }
    return pages;
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
          <h4 className="card-title">District Master</h4>
          {!showForm ? (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search District"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  setFormData({ districtName: "", districtCode: "" });
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
                    <th>District Name</th>
                    <th>District Code</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((d) => (
                    <tr key={d.id}>
                      <td>{d.districtName}</td>
                      <td>{d.districtCode}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={d.status === "y"}
                            onChange={() =>
                              handleSwitchChange(
                                d.id,
                                d.status === "y" ? "n" : "y"
                              )
                            }
                          />
                          <label className="form-check-label">
                            {d.status === "y" ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(d)}
                          disabled={d.status !== "y"}
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
                  {filteredDistricts.length}
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
                  District Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.districtName}
                  onChange={(e) =>
                    setFormData({ ...formData, districtName: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-4">
                <label>
                  District Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.districtCode}
                  onChange={(e) =>
                    setFormData({ ...formData, districtCode: e.target.value })
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
                <h5 className="modal-title">District Reports</h5>
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
                      districtData.find((d) => d.id === confirmDialog.districtId)
                        ?.districtName
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

export default DistrictMaster;
