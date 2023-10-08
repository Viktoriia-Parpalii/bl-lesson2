import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';
import { MyModal } from 'components/MyModal/MyModal';

export class Gallery extends Component {
  state = {
    query: '',
    page: 1,
    images: [],
    loading: false,
    error: null,
    isEmpty: false,
    isVisible: false,
    showModal: false,
    largeImg: '',
    alt: '',
  };

  componentDidUpdate(_, prevState) {
    const { query, page } = this.state;
    if (prevState.query !== query || prevState.page !== page) {
      this.getPhotos(query, page);
    }
  }
  getPhotos = async (query, page) => {
    if (!query) {
      return;
    }
    this.setState({ loading: true });
    try {
      const {
        photos,
        total_results,
        page: currentPage,
        per_page,
      } = await ImageService.getImages(query, page);

      if (photos.length === 0) {
        this.setState({ isEmpty: true });
      }

      this.setState(prevState => ({
        images: [...prevState.images, ...photos],
        isVisible: currentPage < Math.ceil(total_results / per_page),
      }));
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  };

  onHandleSubmit = value => {
    this.setState({
      query: value,
      page: 1,
      images: [],
      error: null,
      isEmpty: false,
    });
  };

  onLoadMore = () => {
    this.setState(prevState => ({page:prevState.page + 1}))
  }

  onOpenModal =(largeImg, alt) => {
    this.setState({showModal:true, largeImg, alt})
  }

  onCloseModal = () => {
       this.setState({showModal:false, largeImg:'', alt:''})
 
  }
  render() {
    const { images, isVisible, loading, isEmpty, error, showModal, largeImg, alt } = this.state;
    return (
      <>
        <SearchForm onSubmit={this.onHandleSubmit} />
        {isEmpty && (
          <Text textAlign="center">Sorry. There are no images ... 😭</Text>
        )}
        {error && (
          <Text textAlign="center">❌ Something went wrong - {error}</Text>
        )}
        <Grid>
          {images.length > 0 &&
            images.map(({ avg_color, id, alt, src }) => (
              <GridItem onClick={()=>this.onOpenModal(src.large, alt)}key={id}>
                <CardItem color={avg_color}>
                  <img src={src.large} alt={alt} />
                </CardItem>
              </GridItem>
            ))}
        </Grid>
{isVisible && <Button onClick={this.onLoadMore} disabled = {loading}>
{loading ? 'Loading...' : "Load more..."}  
</Button>}
<MyModal modalIsOpen={showModal} closeModal={this.onCloseModal} largeImg={largeImg} alt={alt}/>
      </>
    );
  }
}
