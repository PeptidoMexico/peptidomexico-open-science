\name{molarity_m}
\alias{molarity_m}
\title{Calculate molarity}
\description{Calculates molarity from mass, molecular weight, and final solution volume.}
\usage{molarity_m(mass_mg, molecular_weight_g_mol, volume_ml)}
\arguments{
  \item{mass_mg}{Peptide mass in milligrams.}
  \item{molecular_weight_g_mol}{Molecular weight in grams per mole.}
  \item{volume_ml}{Final solution volume in millilitres.}
}
\value{Molarity in moles per litre.}
\examples{
molarity_m(10, 1000, 10)
}
