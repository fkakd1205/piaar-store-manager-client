import { useState } from 'react';
import styled from 'styled-components';
import DrawerNavbarMain from '../../../component/nav/DrawerNavbarMain';
import ManagementNavbar from '../../../component/sales-performance-v2/navbar/ManagementNavbar';
import ProductPerformanceComponent from '../../../component/sales-performance-v2/product-performance';

const Container = styled.div`
    position: relative;
    height: 100%;
    min-height: 100vh;
    background-color: var(--piaar-background-color);
`;

const ProductPerformancePage = () => {
    const [navbarOpen, setNavbarOpen] = useState(true);

    const onActionOpenNavbar = () => {
        setNavbarOpen(true);
    }
    
    const onActionCloseNavbar = () => {
        setNavbarOpen(false);
    }

    return(
        <>
            <Container>
                <DrawerNavbarMain></DrawerNavbarMain>
                <ManagementNavbar
                    navbarOpen={navbarOpen}

                    onActionOpenNavbar={onActionOpenNavbar}
                    onActionCloseNavbar={onActionCloseNavbar}
                />
                <ProductPerformanceComponent
                    navbarOpen={navbarOpen}
                />
            </Container>
        </>
    )
}

export default ProductPerformancePage;