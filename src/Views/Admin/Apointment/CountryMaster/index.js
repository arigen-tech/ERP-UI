import { useState } from "react";

const CountryMaster = () => {
  const [formData, setFormData] = useState({ countryName: "", countryCode: "" });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const [countryData, setCountryData] = useState([
    { id: 1, countryName: "India", countryCode: "IN", status: "y" },
    { id: 2, countryName: "United States", countryCode: "US", status: "y" },
    { id: 3, countryName: "Australia", countryCode: "AU", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    countryId: null,
    newStatus: null,
  });

  const filteredCountries = countryData.filter((country) =>
    country.countryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

  const currentItems = filteredCountries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, countryId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.countryId !== null) {
      setCountryData((prev) =>
        prev.map((country) =>
          country.id === confirmDialog.countryId
            ? { ...country, status: confirmDialog.newStatus }
            : country
        )
      );
    }
    setConfirmDialog({ isOpen: false, countryId: null, newStatus: null });
  };

  const handleEdit = (country) => {
    setEditingCountry(country);
    setFormData({
      countryName: country.countryName,
      countryCode: country.countryCode,
    });
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const { countryName, countryCode } = formData;
    if (!countryName || !countryCode) return;

    if (editingCountry) {
      setCountryData((prev) =>
        prev.map((country) =>
          country.id === editingCountry.id
            ? { ...country, countryName, countryCode }
            : country
        )
      );
    } else {
      setCountryData([
        ...countryData,
        { id: Date.now(), countryName, countryCode, status: "y" },
      ]);
    }

    setEditingCountry(null);
    setShowForm(false);
    setFormData({ countryName: "", countryCode: "" });
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
          <h4 className="card-title">Country Master</h4>
          {!showForm ? (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search Country"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  setFormData({ countryName: "", countryCode: "" });
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
                    <th>Country Name</th>
                    <th>Country Code</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((country) => (
                    <tr key={country.id}>
                      <td>{country.countryName}</td>
                      <td>{country.countryCode}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={country.status === "y"}
                            onChange={() =>
                              handleSwitchChange(
                                country.id,
                                country.status === "y" ? "n" : "y"
                              )
                            }
                          />
                          <label className="form-check-label">
                            {country.status === "y" ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(country)}
                          disabled={country.status !== "y"}
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
                  {filteredCountries.length}
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
                  Country Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.countryName}
                  onChange={(e) =>
                    setFormData({ ...formData, countryName: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-4">
                <label>
                  Country Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.countryCode}
                  onChange={(e) =>
                    setFormData({ ...formData, countryCode: e.target.value })
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
                <h5 className="modal-title">Country Reports</h5>
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
                      countryData.find((c) => c.id === confirmDialog.countryId)
                        ?.countryName
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

export default CountryMaster;
