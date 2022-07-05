import styled from 'styled-components';
import DrawerNavbarMain from '../../component/nav/DrawerNavbarMain';
import SalesPerformanceComponent from '../../component/sales_performance';

const Container = styled.div`

`;

const SalesAnalysisPage = (props) => {
    return(
        <>
            <Container>
                <DrawerNavbarMain></DrawerNavbarMain>
                <SalesPerformanceComponent></SalesPerformanceComponent>
            </Container>
        </>
    )
}

export default SalesAnalysisPage;