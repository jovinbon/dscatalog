import { AxiosRequestConfig } from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { Product } from 'types/product';
import { requestBackend } from 'util/requests';
import './styles.css';

type urlParams = {
  productId: string;
};

const Form = () => {

  const { productId } = useParams<urlParams>();

  const isEditing = productId !== 'create';

  const history = useHistory();

  const { register, handleSubmit, formState: {errors}, setValue } = useForm<Product>();

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


  const onSubmit = (productData: Product) => {

    const data = {...productData, imgUrl: isEditing ? productData.imgUrl : "https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/3-big.jpg", 
                                  categories: isEditing ? productData.categories : [ {id: 1, name: ""} ]};

    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `/products/${productId}` : "/products",
      data,
      withCredentials: true
    };

    requestBackend(config)
      .then(() => {
        history.push("/admin/products");
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
                        required: 'Campo obrigatório.'
                    })}
                    type="text"
                    className={`form-control base-input ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Nome do produto"
                    name="name"
                  />
                  <div className="invalid-feedback d-block">{errors.name?.message}</div>
              </div>
              <div className="margin-bottom-30">
                  <input
                    {...register('price', {
                        required: 'Campo obrigatório.'
                    })}
                    type="text"
                    className={`form-control base-input ${errors.price ? 'is-invalid' : ''}`}
                    placeholder="Preço"
                    name="price"
                  />
                  <div className="invalid-feedback d-block">{errors.price?.message}</div>
              </div>
              <button className="btn btn-secondary text-white">ADICIONAR IMAGEM</button>
              <p>As imagens devem ser JPG ou PNG e não devem ultrapassar 5mb.</p>
            </div>
            <div className="col-lg-6">
              <div>
                <textarea 
                rows={8.9} 
                {...register('description', {
                  required: 'Campo obrigatório.'
                })}
                className={`form-control base-input h-auto ${errors.description ? 'is-invalid' : ''}`}
                placeholder="Descrição" 
                name="description"
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
