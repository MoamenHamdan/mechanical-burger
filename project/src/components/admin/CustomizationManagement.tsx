import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Settings } from 'lucide-react';
import { CustomizationOption, Category } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';
import { customizationService } from '../../services/firebaseService';

interface CustomizationManagementProps {
  customizations: CustomizationOption[];
  categories: Category[];
}

export const CustomizationManagement: React.FC<CustomizationManagementProps> = ({ 
  customizations, 
  categories 
}) => {
  const [editingCustomization, setEditingCustomization] = useState<CustomizationOption | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<CustomizationOption>>({
    name: '',
    type: 'add',
    price: 0,
    categoryId: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  const handleEdit = (customization: CustomizationOption) => {
    setEditingCustomization(customization);
    setFormData(customization);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingCustomization(null);
    setFormData({
      name: '',
      type: 'add',
      price: 0,
      categoryId: '',
      isActive: true
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) return;

    setLoading(true);
    try {
      if (editingCustomization) {
        await customizationService.update(editingCustomization.id, formData);
      } else {
        await customizationService.create(formData as Omit<CustomizationOption, 'id' | 'createdAt' | 'updatedAt'>);
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving customization:', error);
      alert('Failed to save customization');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customization?')) return;

    setLoading(true);
    try {
      await customizationService.delete(id);
    } catch (error) {
      console.error('Error deleting customization:', error);
      alert('Failed to delete customization');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingCustomization(null);
    setIsCreating(false);
    setFormData({
      name: '',
      type: 'add',
      price: 0,
      categoryId: '',
      isActive: true
    });
  };

  return (
    <div className="space-y-8">
      {/* Add New Customization Button */}
      <div className="flex justify-center">
        <MechanicalButton onClick={handleCreate} size="lg" className="flex items-center space-x-3">
          <Plus size={24} />
          <span>ADD NEW CUSTOMIZATION</span>
        </MechanicalButton>
      </div>

      {/* Edit/Create Form */}
      {(editingCustomization || isCreating) && (
        <MechanicalCard hover={false}>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Settings className="text-blue-400" />
              {isCreating ? 'CREATE NEW CUSTOMIZATION' : 'EDIT CUSTOMIZATION'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">NAME:</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Customization name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">TYPE:</label>
                <select
                  value={formData.type || 'add'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CustomizationOption['type'] })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="add">Add</option>
                  <option value="extra">Extra</option>
                  <option value="remove">Remove</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">PRICE:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || 0}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">CATEGORY (Optional):</label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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

      {/* Customizations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customizations.map((customization) => {
          const category = categories.find(c => c.id === customization.categoryId);
          return (
            <MechanicalCard key={customization.id}>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white">{customization.name}</h3>
                    <span className="text-xl font-bold text-orange-400">
                      {customization.price > 0 ? `+$${customization.price.toFixed(2)}` : 'FREE'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      customization.type === 'remove' ? 'bg-red-600 text-white' :
                      customization.type === 'add' ? 'bg-green-600 text-white' :
                      'bg-orange-600 text-white'
                    }`}>
                      {customization.type.toUpperCase()}
                    </span>
                    {category && (
                      <span className="px-2 py-1 bg-gray-600 text-white rounded text-xs">
                        {category.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <MechanicalButton
                      onClick={() => handleEdit(customization)}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      disabled={loading}
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </MechanicalButton>
                    
                    <MechanicalButton
                      onClick={() => handleDelete(customization.id)}
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
          );
        })}
      </div>

      {customizations.length === 0 && (
        <div className="text-center py-12">
          <Settings size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Customizations Yet</h3>
          <p className="text-gray-500">Create customization options for your burgers</p>
        </div>
      )}
    </div>
  );
};