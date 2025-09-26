import { useState } from "react";

const ItemClassMaster = () => {
  const [formData, setFormData] = useState({ itemClassName: "", itemClassCode: "" });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [editingItemClass, setEditingItemClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const [itemClassData, setItemClassData] = useState([
    { id: 1, itemClassName: "Electronics", itemClassCode: "EL", status: "y" },
    { id: 2, itemClassName: "Furniture", itemClassCode: "FR", status: "y" },
    { id: 3, itemClassName: "Stationery", itemClassCode: "ST", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemClassId: null,
    newStatus: null,
  });

  // 🔍 Search filter
  const filteredItemClasses = itemClassData.filter((item) =>
    item.itemClassName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItemClasses.length / itemsPerPage);

  const currentItems = filteredItemClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // ✅ Status Toggle (with confirmation)
  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, itemClassId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.itemClassId !== null) {
      setItemClassData((prev) =>
        prev.map((item) =>
          item.id === confirmDialog.itemClassId
            ? { ...item, status: confirmDialog.newStatus }
            : item
        )
      );
    }
    setConfirmDialog({ isOpen: false, itemClassId: null, newStatus: null });
  };

  // ✏️ Edit
  const handleEdit = (item) => {
    setEditingItemClass(item);
    setFormData({
      itemClassName: item.itemClassName,
      itemClassCode: item.itemClassCode,
    });
    setShowForm(true);
  };

  // 💾 Save
  const handleSave = (e) => {
    e.preventDefault();
    const { itemClassName, itemClassCode } = formData;
    if (!itemClassName || !itemClassCode) return;

    if (editingItemClass) {
      setItemClassData((prev) =>
        prev.map((item) =>
          item.id === editingItemClass.id
            ? { ...item, itemClassName, itemClassCode }
            : item
        )
      );
    } else {
      setItemClassData([
        ...itemClassData,
        { id: Date.now(), itemClassName, itemClassCode, status: "y" },
      ]);
    }

    setEditingItemClass(null);
    setShowForm(false);
    setFormData({ itemClassName: "", itemClassCode: "" });
    setIsFormValid(false);
  };

  // 📑 Pagination
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === currentPage ? "active" : ""}`}>
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
          <h4 className="card-title">Item Class Master</h4>
          {!showForm ? (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search Item Class"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  setFormData({ itemClassName: "", itemClassCode: "" });
                  setShowForm(true);
                }}
              >
                <i className="mdi mdi-plus"></i> Add
              </button>
              <button className="btn btn-success" onClick={() => setShowModal(true)}>
                <i className="mdi mdi-file-document"></i> Reports
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
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
                    <th>Item Class Name</th>
                    <th>Item Class Code</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.itemClassName}</td>
                      <td>{item.itemClassCode}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={item.status === "y"}
                            onChange={() =>
                              handleSwitchChange(item.id, item.status === "y" ? "n" : "y")
                            }
                          />
                          <label className="form-check-label">
                            {item.status === "y" ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(item)}
                          disabled={item.status !== "y"}
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
                  {filteredItemClasses.length}
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
                  <button className="btn btn-primary" onClick={handlePageNavigation}>
                    Go
                  </button>
                </div>
              </nav>
            </>
          ) : (
            <form onSubmit={handleSave} className="row">
              <div className="form-group col-md-4">
                <label>
                  Item Class Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.itemClassName}
                  onChange={(e) =>
                    setFormData({ ...formData, itemClassName: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-4">
                <label>
                  Item Class Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.itemClassCode}
                  onChange={(e) =>
                    setFormData({ ...formData, itemClassCode: e.target.value })
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
                <h5 className="modal-title">Item Class Reports</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Report feature will be implemented...</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
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
                <button className="btn-close" onClick={() => handleConfirm(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to{" "}
                  {confirmDialog.newStatus === "y" ? "activate" : "deactivate"}{" "}
                  <strong>
                    {itemClassData.find((c) => c.id === confirmDialog.itemClassId)
                      ?.itemClassName}
                  </strong>
                  ?
                </p>
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
  );
};

export default ItemClassMaster;
