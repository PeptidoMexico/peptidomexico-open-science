#' Validate a positive scalar laboratory input.
#'
#' @param value Numeric value to validate.
#' @param name Human-readable input name used in the error message.
#' @return The validated numeric value, invisibly.
#' @keywords internal
validate_positive <- function(value, name) {
  if (length(value) != 1L || !is.numeric(value) || !is.finite(value) || value <= 0) {
    stop(sprintf("%s must be one finite number greater than zero.", name), call. = FALSE)
  }
  value
}

#' Calculate the diluent volume needed for reconstitution.
#'
#' @param mass_mg Lyophilized peptide mass in milligrams.
#' @param target_mg_ml Desired final concentration in milligrams per millilitre.
#' @return Required diluent volume in millilitres.
#' @examples
#' reconstitution_volume_ml(10, 2)
#' @export
reconstitution_volume_ml <- function(mass_mg, target_mg_ml) {
  mass_mg <- validate_positive(mass_mg, "mass_mg")
  target_mg_ml <- validate_positive(target_mg_ml, "target_mg_ml")
  mass_mg / target_mg_ml
}

#' Calculate the concentration of a prepared solution.
#'
#' @param mass_mg Peptide mass in milligrams.
#' @param volume_ml Final solution volume in millilitres.
#' @return Concentration in milligrams per millilitre.
#' @examples
#' concentration_mg_ml(10, 5)
#' @export
concentration_mg_ml <- function(mass_mg, volume_ml) {
  mass_mg <- validate_positive(mass_mg, "mass_mg")
  volume_ml <- validate_positive(volume_ml, "volume_ml")
  mass_mg / volume_ml
}

#' Plan a single-step dilution.
#'
#' @param stock_mg_ml Starting concentration in milligrams per millilitre.
#' @param target_mg_ml Desired concentration in milligrams per millilitre.
#' @param final_volume_ml Desired final volume in millilitres.
#' @return A named list with stock and diluent volumes in millilitres.
#' @examples
#' dilution_plan(10, 2, 5)
#' @export
dilution_plan <- function(stock_mg_ml, target_mg_ml, final_volume_ml) {
  stock_mg_ml <- validate_positive(stock_mg_ml, "stock_mg_ml")
  target_mg_ml <- validate_positive(target_mg_ml, "target_mg_ml")
  final_volume_ml <- validate_positive(final_volume_ml, "final_volume_ml")
  if (target_mg_ml > stock_mg_ml) {
    stop("target_mg_ml cannot exceed stock_mg_ml for a dilution.", call. = FALSE)
  }
  stock_volume_ml <- target_mg_ml * final_volume_ml / stock_mg_ml
  list(
    stock_volume_ml = stock_volume_ml,
    diluent_volume_ml = final_volume_ml - stock_volume_ml,
    final_volume_ml = final_volume_ml,
    target_mg_ml = target_mg_ml
  )
}

#' Calculate molarity from mass, molecular weight, and volume.
#'
#' @param mass_mg Peptide mass in milligrams.
#' @param molecular_weight_g_mol Molecular weight in grams per mole.
#' @param volume_ml Final solution volume in millilitres.
#' @return Molarity in moles per litre.
#' @examples
#' molarity_m(10, 1000, 10)
#' @export
molarity_m <- function(mass_mg, molecular_weight_g_mol, volume_ml) {
  mass_mg <- validate_positive(mass_mg, "mass_mg")
  molecular_weight_g_mol <- validate_positive(molecular_weight_g_mol, "molecular_weight_g_mol")
  volume_ml <- validate_positive(volume_ml, "volume_ml")
  (mass_mg / 1000) / molecular_weight_g_mol / (volume_ml / 1000)
}
