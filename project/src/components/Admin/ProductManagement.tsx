import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Image as ImageIcon,
  DollarSign,
  Archive,
  Eye,
  EyeOff
} from 'lucide-react';

const ProductManagement: React.FC = () => {
  const { 
    products, 
    branches,
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    images: [''],
    category: '',
    branchId: '',
    stock: 0,
    materials: [''],
    isActive: true
  });

  const categories = ['Slime Kits', 'Art Supplies', 'Kids Supplies', 'Craft Materials', 'Premium Kits'];

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.description && newProduct.price > 0) {
      const filteredImages = newProduct.images.filter(img => img.trim() !== '');
      const filteredMaterials = newProduct.materials.filter(mat => mat.trim() !== '');
      
      await addProduct({
        ...newProduct,
        images: filteredImages.length > 0 ? filteredImages : ['https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'],
        materials: filteredMaterials.length > 0 ? filteredMaterials : ['Basic materials']
      });
      
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        images: [''],
        category: '',
        branchId: '',
        stock: 0,
        materials: [''],
        isActive: true
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      const filteredImages = editingProduct.images.filter((img: string) => img.trim() !== '');
      const filteredMaterials = editingProduct.materials.filter((mat: string) => mat.trim() !== '');
      
      await updateProduct({
        ...editingProduct,
        images: filteredImages.length > 0 ? filteredImages : ['https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'],
        materials: filteredMaterials.length > 0 ? filteredMaterials : ['Basic materials']
      });
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      await deleteProduct(id);
    }
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'All Branches';
  };

  const addImageField = (isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, '']
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: [...newProduct.images, '']
      });
    }
  };

  const removeImageField = (index: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      const newImages = editingProduct.images.filter((_: any, i: number) => i !== index);
      setEditingProduct({
        ...editingProduct,
        images: newImages.length > 0 ? newImages : ['']
      });
    } else {
      const newImages = newProduct.images.filter((_, i) => i !== index);
      setNewProduct({
        ...newProduct,
        images: newImages.length > 0 ? newImages : ['']
      });
    }
  };

  const updateImageField = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingProduct) {
      const newImages = [...editingProduct.images];
      newImages[index] = value;
      setEditingProduct({
        ...editingProduct,
        images: newImages
      });
    } else {
      const newImages = [...newProduct.images];
      newImages[index] = value;
      setNewProduct({
        ...newProduct,
        images: newImages
      });
    }
  };

  const addMaterialField = (isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        materials: [...editingProduct.materials, '']
      });
    } else {
      setNewProduct({
        ...newProduct,
        materials: [...newProduct.materials, '']
      });
    }
  };

  const removeMaterialField = (index: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      const newMaterials = editingProduct.materials.filter((_: any, i: number) => i !== index);
      setEditingProduct({
        ...editingProduct,
        materials: newMaterials.length > 0 ? newMaterials : ['']
      });
    } else {
      const newMaterials = newProduct.materials.filter((_, i) => i !== index);
      setNewProduct({
        ...newProduct,
        materials: newMaterials.length > 0 ? newMaterials : ['']
      });
    }
  };

  const updateMaterialField = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingProduct) {
      const newMaterials = [...editingProduct.materials];
      newMaterials[index] = value;
      setEditingProduct({
        ...editingProduct,
        materials: newMaterials
      });
    } else {
      const newMaterials = [...newProduct.materials];
      newMaterials[index] = value;
      setNewProduct({
        ...newProduct,
        materials: newMaterials
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Product Management</h3>
          <p className="text-gray-600">Manage all products across branches</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg';
                }}
              />
              {product.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  +{product.images.length - 1} more
                </div>
              )}
              <div className="absolute top-2 left-2 flex items-center space-x-1">
                {product.isActive ? (
                  <Eye className="h-4 w-4 text-green-600 bg-white rounded p-1" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400 bg-white rounded p-1" />
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {product.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Stock: {product.stock}
                </span>
              </div>

              <h4 className="font-bold text-gray-800 mb-2">{product.name}</h4>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">Materials:</p>
                <div className="flex flex-wrap gap-1">
                  {product.materials.slice(0, 3).map((material, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {material}
                    </span>
                  ))}
                  {product.materials.length > 3 && (
                    <span className="text-gray-500 text-xs">+{product.materials.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                <span className="text-sm text-gray-600">{getBranchName(product.branchId)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                  <select
                    value={newProduct.branchId}
                    onChange={(e) => setNewProduct({ ...newProduct, branchId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Branches</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Product Images</label>
                  <button
                    onClick={() => addImageField(false)}
                    className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {newProduct.images.map((image, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImageField(index, e.target.value, false)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter image URL"
                      />
                      {newProduct.images.length > 1 && (
                        <button
                          onClick={() => removeImageField(index, false)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Materials Included</label>
                  <button
                    onClick={() => addMaterialField(false)}
                    className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Material</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {newProduct.materials.map((material, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => updateMaterialField(index, e.target.value, false)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter material name"
                      />
                      {newProduct.materials.length > 1 && (
                        <button
                          onClick={() => removeMaterialField(index, false)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newProduct.isActive}
                  onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Product (visible to customers)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                  <select
                    value={editingProduct.branchId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, branchId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Branches</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Product Images</label>
                  <button
                    onClick={() => addImageField(true)}
                    className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingProduct.images.map((image: string, index: number) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImageField(index, e.target.value, true)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter image URL"
                      />
                      {editingProduct.images.length > 1 && (
                        <button
                          onClick={() => removeImageField(index, true)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Materials Included</label>
                  <button
                    onClick={() => addMaterialField(true)}
                    className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Material</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingProduct.materials.map((material: string, index: number) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => updateMaterialField(index, e.target.value, true)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter material name"
                      />
                      {editingProduct.materials.length > 1 && (
                        <button
                          onClick={() => removeMaterialField(index, true)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingProduct.isActive}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm font-medium text-gray-700">
                  Active Product (visible to customers)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;