import { useState } from "react";

const CategoryMaster = () => {
  const [formData, setFormData] = useState({ categoryName: "", categoryCode: "" });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const [categoryData, setCategoryData] = useState([
    { id: 1, categoryName: "Electronics", categoryCode: "C001", status: "y" },
    { id: 2, categoryName: "Clothing", categoryCode: "C002", status: "y" },
    { id: 3, categoryName: "Furniture", categoryCode: "C003", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    categoryId: null,
    newStatus: null,
  });

  const filteredCategories = categoryData.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const currentItems = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, categoryId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.categoryId !== null) {
      setCategoryData((prev) =>
        prev.map((cat) =>
          cat.id === confirmDialog.categoryId
            ? { ...cat, status: confirmDialog.newStatus }
            : cat
        )
      );
    }
    setConfirmDialog({ isOpen: false, categoryId: null, newStatus: null });
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      categoryName: cat.categoryName,
      categoryCode: cat.categoryCode,
    });
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const { categoryName, categoryCode } = formData;
    if (!categoryName || !categoryCode) return;

    if (editingCategory) {
      setCategoryData((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, categoryName, categoryCode }
            : cat
        )
      );
    } else {
      setCategoryData([
        ...categoryData,
        { id: Date.now(), categoryName, categoryCode, status: "y" },
      ]);
    }

    setEditingCategory(null);
    setShowForm(false);
    setFormData({ categoryName: "", categoryCode: "" });
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
          <h4 className="card-title">Category Master</h4>
          {!showForm ? (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search Category"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  setFormData({ categoryName: "", categoryCode: "" });
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
                    <th>Category Name</th>
                    <th>Category Code</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.categoryName}</td>
                      <td>{cat.categoryCode}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={cat.status === "y"}
                            onChange={() =>
                              handleSwitchChange(
                                cat.id,
                                cat.status === "y" ? "n" : "y"
                              )
                            }
                          />
                          <label className="form-check-label">
                            {cat.status === "y" ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(cat)}
                          disabled={cat.status !== "y"}
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
                  {filteredCategories.length}
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
                  Category Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.categoryName}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryName: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-4">
                <label>
                  Category Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.categoryCode}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryCode: e.target.value })
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
                <h5 className="modal-title">Category Reports</h5>
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
                      categoryData.find((c) => c.id === confirmDialog.categoryId)
                        ?.categoryName
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

export default CategoryMaster;
