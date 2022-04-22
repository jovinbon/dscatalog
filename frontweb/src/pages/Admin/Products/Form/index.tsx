import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Category } from 'types/category';
import { Product } from 'types/product';
import { requestBackend } from 'util/requests';
import { toast } from 'react-toastify';

import './styles.css';

type urlParams = {
  productId: string;
};

const Form = () => {

  const { productId } = useParams<urlParams>();

  const [selectCategories, setSelectCategories] = useState<Category[]>([]);

  const isEditing = productId !== 'create';

  const history = useHistory();

  const { register, handleSubmit, formState: {errors}, setValue, control } = useForm<Product>();

  useEffect(() => {
    if (isEditing) {
       requestBackend( { url: `/products/${productId}` } )
            .then((response) => {

              const product = response.data as Product;

              setValue('name', product.name);
              setValue('price', product.price);
              setValue('description', product.description);
              setValue('imgUrl', product.imgUrl);
              setValue('categories', product.categories);
            });
    }
  }, [isEditing, productId, setValue]);

  useEffect(() => {
    requestBackend({url: "/categories"})
      .then(response => {
        setSelectCategories(response.data.content);
      })
  }, []);


  const onSubmit = (productData: Product) => {

    const data = {...productData, price: String(productData.price).replace(",",".")};

    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `/products/${productId}` : "/products",
      data,
      withCredentials: true
    };

    requestBackend(config)
      .then(() => {
        toast.info('Produto cadastrado com sucesso')
        history.push("/admin/products");
      })
      .catch(() => {
        toast.error('Erro ao cadastrar produto')
      });
  };

  const handleCancel = () => {
     history.push("/admin/products");
  }

  return (
    <div className="product-crud-container">
      <div className="base-card  product-crud-form-card">
        <h1 className="product-crud-form-title">DADOS DO PRODUTO</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row product-crud-inputs-container">
            <div className="col-lg-6 product-crud-inputs-left-container">
              <div className="margin-bottom-30">
                  <input
                    {...register('name', {
                        required: 'Campo obrigatório'
                    })}
                    type="text"
                    className={`form-control base-input ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Nome do produto"
                    name="name"
                    data-testid="name"
                  />
                  <div className="invalid-feedback d-block">{errors.name?.message}</div>
              </div>
              <div className="margin-bottom-30">
                  <label htmlFor="categories" className='d-none'>Categorias</label>
                  <Controller 
                    name="categories"
                    rules={{required: true}}
                    control={control}
                    render={({field}) => (
                      <Select {...field} 
                        options={selectCategories}
                        classNamePrefix="product-crud-select"
                        isMulti
                        getOptionLabel={(category: Category) => category.name}
                        getOptionValue={(category: Category) => String(category.id)}
                        inputId="categories"
                    />
                    )}
                  />  
                  {errors.categories && (
                    <div className="invalid-feedback d-block">Campo obrigatório</div>
                  )

                  }
              </div>
              <div className="margin-bottom-30">
                  <Controller 
                    name="price"
                    rules={{required: 'Campo obrigatório'}}
                    control={control}
                    render={({field}) => (
                      <CurrencyInput 
                      placeholder="Preço"
                      className={`form-control base-input ${errors.price ? 'is-invalid' : ''}`}
                      disableGroupSeparators={true}
                      value={field.value}
                      onValueChange={field.onChange}
                      data-testid="price"
                      />
                    )}
                  />
                  <div className="invalid-feedback d-block">{errors.price?.message}</div>
              </div>
              <div className="margin-bottom-30">
                  <input
                    {...register('imgUrl', {
                      required: 'Campo obrigatório',
                      pattern: {
                          value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                          message: 'Deve ser uma URL válida'
                      }
                    })}
                    type="text"
                    className={`form-control base-input ${errors.imgUrl ? 'is-invalid' : ''}`}
                    placeholder="URL imagem do produto"
                    name="imgUrl"
                    data-testid="imgUrl"
                  />
                  <div className="invalid-feedback d-block">{errors.imgUrl?.message}</div>
              </div>
              <button className="btn btn-secondary text-white">ADICIONAR IMAGEM</button>
              <p>As imagens devem ser JPG ou PNG e não devem ultrapassar 5mb.</p>
            </div>
            <div className="col-lg-6">
              <div>
                <textarea 
                rows={8.9} 
                {...register('description', {
                  required: 'Campo obrigatório'
                })}
                className={`form-control base-input h-auto ${errors.description ? 'is-invalid' : ''}`}
                placeholder="Descrição" 
                name="description"
                data-testid="description"
                />
                <div className="invalid-feedback d-block">{errors.description?.message}</div>
              </div>
            </div>
          </div>
          <div className="product-crud-buttons-container">
            <button className="btn btn-outline-danger product-crud-buttom" onClick={handleCancel}>CANCELAR</button>
            <button className="btn btn-primary text-white product-crud-buttom">SALVAR</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
