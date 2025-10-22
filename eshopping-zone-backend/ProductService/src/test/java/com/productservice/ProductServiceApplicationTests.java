package com.productservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ProductServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void mainRunsWithoutException() {
		ProductServiceApplication.main(new String[]{});
	}

	@Test
	void applicationClassExists() {
		assertThat(ProductServiceApplication.class).isNotNull();
	}
}