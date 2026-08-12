\name{dilution_plan}
\alias{dilution_plan}
\title{Plan a single-step dilution}
\description{Calculates stock and diluent volumes for a target concentration and final volume.}
\usage{dilution_plan(stock_mg_ml, target_mg_ml, final_volume_ml)}
\arguments{
  \item{stock_mg_ml}{Starting concentration in milligrams per millilitre.}
  \item{target_mg_ml}{Desired concentration in milligrams per millilitre.}
  \item{final_volume_ml}{Desired final volume in millilitres.}
}
\value{A named list containing stock, diluent, final volume, and target concentration in millilitres or milligrams per millilitre.}
\examples{
dilution_plan(10, 2, 5)
}
