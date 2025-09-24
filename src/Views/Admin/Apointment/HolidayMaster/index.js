import { useState } from "react";

const HolidayMaster = () => {
  const [formData, setFormData] = useState({ holidayName: "", holidayDate: "" });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const [holidayData, setHolidayData] = useState([
    { id: 1, holidayName: "New Year", holidayDate: "2025-01-01", status: "y" },
    { id: 2, holidayName: "Republic Day", holidayDate: "2025-01-26", status: "y" },
    { id: 3, holidayName: "Independence Day", holidayDate: "2025-08-15", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    holidayId: null,
    newStatus: null,
  });

  const filteredHolidays = holidayData.filter((holiday) =>
    holiday.holidayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTotalPages = Math.ceil(filteredHolidays.length / itemsPerPage);

  const currentItems = filteredHolidays.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, holidayId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.holidayId !== null) {
      setHolidayData((prev) =>
        prev.map((holiday) =>
          holiday.id === confirmDialog.holidayId
            ? { ...holiday, status: confirmDialog.newStatus }
            : holiday
        )
      );
    }
    setConfirmDialog({ isOpen: false, holidayId: null, newStatus: null });
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      holidayName: holiday.holidayName,
      holidayDate: holiday.holidayDate,
    });
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const { holidayName, holidayDate } = formData;
    if (!holidayName || !holidayDate) return;

    if (editingHoliday) {
      setHolidayData((prev) =>
        prev.map((holiday) =>
          holiday.id === editingHoliday.id
            ? { ...holiday, holidayName, holidayDate }
            : holiday
        )
      );
    } else {
      setHolidayData([
        ...holidayData,
        { id: Date.now(), holidayName, holidayDate, status: "y" },
      ]);
    }

    setEditingHoliday(null);
    setShowForm(false);
    setFormData({ holidayName: "", holidayDate: "" });
    setIsFormValid(false);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= filteredTotalPages; i++) {
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
    if (page > 0 && page <= filteredTotalPages) {
      setCurrentPage(page);
    } else {
      alert("Invalid page number");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Holiday Master</h4>
          {!showForm && (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search Holiday"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  setFormData({ holidayName: "", holidayDate: "" });
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
          )}
          {showForm && (
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
                    <th>Holiday Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((holiday) => (
                    <tr key={holiday.id}>
                      <td>{holiday.holidayName}</td>
                      <td>{holiday.holidayDate}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={holiday.status === "y"}
                            onChange={() =>
                              handleSwitchChange(
                                holiday.id,
                                holiday.status === "y" ? "n" : "y"
                              )
                            }
                          />
                          <label className="form-check-label">
                            {holiday.status === "y" ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(holiday)}
                          disabled={holiday.status !== "y"}
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
                  Page {currentPage} of {filteredTotalPages} | Total Records:{" "}
                  {filteredHolidays.length}
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
                  Holiday Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.holidayName}
                  onChange={(e) =>
                    setFormData({ ...formData, holidayName: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-4">
                <label>
                  Holiday Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.holidayDate}
                  onChange={(e) =>
                    setFormData({ ...formData, holidayDate: e.target.value })
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
                <h5 className="modal-title">Holiday Reports</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Report will be implemented...</p>
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
                      holidayData.find(
                        (h) => h.id === confirmDialog.holidayId
                      )?.holidayName
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

export default HolidayMaster;
