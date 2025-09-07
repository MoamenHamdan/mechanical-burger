import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, FolderPlus } from 'lucide-react';
import { Category } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';
import { categoriesService } from '../../services/firebaseService';

interface CategoryManagementProps {
  categories: Category[];
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories }) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData(category);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: ''
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) return;

    setLoading(true);
    try {
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, formData);
      } else {
        await categoriesService.create(formData as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>);
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    try {
      await categoriesService.delete(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="space-y-8">
      {/* Add New Category Button */}
      <div className="flex justify-center">
        <MechanicalButton onClick={handleCreate} size="lg" className="flex items-center space-x-3">
          <FolderPlus size={24} />
          <span>ADD NEW CATEGORY</span>
        </MechanicalButton>
      </div>

      {/* Edit/Create Form */}
      {(editingCategory || isCreating) && (
        <MechanicalCard hover={false}>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Edit className="text-blue-400" />
              {isCreating ? 'CREATE NEW CATEGORY' : 'EDIT CATEGORY'}
            </h3>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">NAME:</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Category name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">DESCRIPTION:</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Category description (optional)"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <MechanicalButton onClick={handleCancel} variant="secondary" disabled={loading}>
                <X size={18} />
                <span>Cancel</span>
              </MechanicalButton>
              
              <MechanicalButton onClick={handleSave} disabled={loading || !formData.name?.trim()}>
                <Save size={18} />
                <span>{loading ? 'Saving...' : (isCreating ? 'Create' : 'Save')}</span>
              </MechanicalButton>
            </div>
          </div>
        </MechanicalCard>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <MechanicalCard key={category.id}>
            <div className="p-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-300 text-sm">{category.description}</p>
                )}
                
                <div className="flex space-x-2 pt-2">
                  <MechanicalButton
                    onClick={() => handleEdit(category)}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    disabled={loading}
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </MechanicalButton>
                  
                  <MechanicalButton
                    onClick={() => handleDelete(category.id)}
                    variant="danger"
                    size="sm"
                    className="flex-1"
                    disabled={loading}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </MechanicalButton>
                </div>
              </div>
            </div>
          </MechanicalCard>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <FolderPlus size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Categories Yet</h3>
          <p className="text-gray-500">Create your first category to organize your burgers</p>
        </div>
      )}
    </div>
  );
};