import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { Burger, Category } from '../../types';
import { MechanicalCard } from '../ui/MechanicalCard';
import { MechanicalButton } from '../ui/MechanicalButton';
import { burgersService } from '../../services/firebaseService';

interface BurgerManagementProps {
  burgers: Burger[];
  categories: Category[];
}

export const BurgerManagement: React.FC<BurgerManagementProps> = ({ burgers, categories }) => {
  const [editingBurger, setEditingBurger] = useState<Burger | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<Partial<Burger>>({
    name: '',
    price: 0,
    image: '',
    ingredients: [''],
    categoryId: ''
  });

  const handleEdit = (burger: Burger) => {
    setEditingBurger(burger);
    setFormData(burger);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingBurger(null);
    setFormData({
      name: '',
      price: 0,
      image: '',
      ingredients: [''],
      categoryId: categories[0]?.id || ''
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim() || !formData.price || !formData.categoryId) return;

    setLoading(true);
    try {
      const burgerData = {
        name: formData.name!.trim(),
        price: formData.price!,
        image: formData.image || 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
        ingredients: formData.ingredients!.filter(ing => ing.trim()),
        categoryId: formData.categoryId!
      };

      if (editingBurger) {
        await burgersService.update(editingBurger.id, burgerData);
      } else {
        await burgersService.create(burgerData);
      }

      handleCancel();
    } catch (error) {
      console.error('Error saving burger:', error);
      alert('Failed to save burger');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this burger?')) return;

    setLoading(true);
    try {
      await burgersService.delete(id);
    } catch (error) {
      console.error('Error deleting burger:', error);
      alert('Failed to delete burger');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingBurger(null);
    setIsCreating(false);
    setFormData({
      name: '',
      price: 0,
      image: '',
      ingredients: [''],
      categoryId: categories[0]?.id || ''
    });
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...(formData.ingredients || [])];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({ 
      ...formData, 
      ingredients: [...(formData.ingredients || []), ''] 
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = (formData.ingredients || []).filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Read the file locally and store as Data URL to avoid Firebase Storage
      const toDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const imageDataUrl = await toDataUrl(file);
      setFormData({ ...formData, image: imageDataUrl });
    } catch (error) {
      console.error('Error reading image:', error);
      alert('Failed to read image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add New Burger Button */}
      <div className="flex justify-center">
        <MechanicalButton onClick={handleCreate} size="lg" className="flex items-center space-x-3">
          <Plus size={24} />
          <span>ADD NEW BURGER</span>
        </MechanicalButton>
      </div>

      {/* Edit/Create Form */}
      {(editingBurger || isCreating) && (
        <MechanicalCard hover={false}>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Edit className="text-blue-400" />
              {isCreating ? 'CREATE NEW BURGER' : 'EDIT BURGER'}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">NAME:</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">PRICE:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">CATEGORY:</label>
                    <select
                      value={formData.categoryId || ''}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">IMAGE:</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center justify-center w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-blue-500 cursor-pointer transition-all ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload size={20} className="mr-2" />
                      {uploadingImage ? 'Uploading Image...' : 'Choose Image from Device'}
                    </label>
                    {formData.image && (
                      <div className="relative">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">INGREDIENTS:</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(formData.ingredients || []).map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500"
                        placeholder="Ingredient name"
                      />
                      <button
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <MechanicalButton onClick={addIngredient} size="sm" variant="secondary">
                    <Plus size={16} />
                    <span>Add Ingredient</span>
                  </MechanicalButton>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <MechanicalButton onClick={handleCancel} variant="secondary" disabled={loading}>
                <X size={18} />
                <span>Cancel</span>
              </MechanicalButton>
              
              <MechanicalButton onClick={handleSave} disabled={loading || !formData.name?.trim() || !formData.categoryId}>
                <Save size={18} />
                <span>{loading ? 'Saving...' : (isCreating ? 'Create' : 'Save')} Burger</span>
              </MechanicalButton>
            </div>
          </div>
        </MechanicalCard>
      )}

      {/* Burger List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {burgers.map((burger) => (
          <MechanicalCard key={burger.id}>
            <div className="p-6">
              {(() => {
                const category = categories.find(c => c.id === burger.categoryId);
                return (
                  <>
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img 
                  src={burger.image} 
                  alt={burger.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white">{burger.name}</h3>
                  <span className="text-xl font-bold text-orange-400">${burger.price.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-600 text-white">
                    {category?.name.toUpperCase() || 'NO CATEGORY'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {burger.ingredients.length} components
                  </span>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <MechanicalButton
                    onClick={() => handleEdit(burger)}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    disabled={loading}
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </MechanicalButton>
                  
                  <MechanicalButton
                    onClick={() => handleDelete(burger.id)}
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
                  </>
                );
              })()}
            </div>
          </MechanicalCard>
        ))}
      </div>

      {burgers.length === 0 && (
        <div className="text-center py-12">
          <Plus size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Burgers Yet</h3>
          <p className="text-gray-500">Create your first burger to get started</p>
        </div>
      )}
    </div>
  );
};