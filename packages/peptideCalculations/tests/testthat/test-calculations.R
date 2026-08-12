test_that("reconstitution volume preserves mass balance", {
  expect_equal(reconstitution_volume_ml(10, 2), 5)
})

test_that("concentration is mass divided by final volume", {
  expect_equal(concentration_mg_ml(12, 4), 3)
})

test_that("dilution plan returns complementary volumes", {
  result <- dilution_plan(10, 2, 5)
  expect_equal(result$stock_volume_ml, 1)
  expect_equal(result$diluent_volume_ml, 4)
  expect_equal(result$final_volume_ml, 5)
})

test_that("molarity uses SI conversions", {
  expect_equal(molarity_m(10, 1000, 10), 0.001)
})

test_that("invalid and concentrating requests fail clearly", {
  expect_error(reconstitution_volume_ml(0, 2), "mass_mg")
  expect_error(dilution_plan(2, 3, 5), "cannot exceed")
})
